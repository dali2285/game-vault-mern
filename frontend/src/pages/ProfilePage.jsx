import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, uploadAvatar } from '../../redux/actions/authActions';
import { listMyOrders, listPurchasedGames } from '../../redux/actions/orderActions';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';

function ProfilePage() {
  const dispatch = useDispatch();
  const { userInfo, profile, loading } = useSelector((state) => state.auth);
  const { loading: libraryLoading, purchasedGames = [], error: libraryError } = useSelector(
    (state) => state.orderLibrary || { loading: false, purchasedGames: [], error: null }
  );
  console.log('[v0] ProfilePage render:', { userInfo, profile, loading, libraryLoading, libraryError });

  const [activeTab, setActiveTab] = useState('orders');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    dispatch(getProfile());
    dispatch(listMyOrders());
    dispatch(listPurchasedGames());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // We'll use a local order state from a sub-selector
  // const orderState = useSelector((state) => {
  //   return { orders: state.gamesList?.orders || [], loading: false };
  // });

  const avatarUrl = preview || profile?.avatarUrl || userInfo?.avatarUrl;
  const displayName = userInfo?.name || profile?.name || 'User';
  const initials = displayName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Please upload a JPG, PNG, or WEBP image.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be smaller than 2MB.', 'error');
      return;
    }

    setSelectedFile(file);
    setRemoveAvatar(false);
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setRemoveAvatar(true);
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setRemoveAvatar(false);
  };

  const handleAvatarSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile && !removeAvatar) {
      setAvatarError('Choose an image or remove your avatar first.');
      return;
    }

    setUploading(true);

    try {
      await dispatch(uploadAvatar(selectedFile, removeAvatar));
      setSelectedFile(null);
      setRemoveAvatar(false);
      showToast(removeAvatar ? 'Avatar removed successfully.' : 'Avatar uploaded successfully.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page profile-page">
      <h1 className="page-title">My <span className="accent">Profile</span></h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <form className="profile-avatar-card" onSubmit={handleAvatarSubmit}>
              <div className="avatar-frame">
                <div className="avatar-mask">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="User avatar" className="profile-avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      {initials}
                    </div>
                  )}
                </div>
                <label htmlFor="avatarInput" className="avatar-upload-btn" title="Choose new avatar">
                  <i class="fa-solid fa-camera"></i>
                </label>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="profile-avatar-meta">
                <h3>{displayName}</h3>
                <p>{userInfo?.email}</p>
                {userInfo?.role === 'admin' && <span className="role-badge">Admin</span>}
              </div>

              <div className="avatar-actions">
                {(selectedFile || removeAvatar) && (
                  <>
                    <button type="submit" className="btn btn-primary btn-full" disabled={uploading}>
                      {uploading ? <span className="spinner-inline"></span> : removeAvatar ? 'Save Removal' : 'Save Avatar'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={handleCancelSelection}>
                      Cancel
                    </button>
                  </>
                )}
                {!selectedFile && !removeAvatar && profile?.avatarUrl && (
                  <button type="button" className="btn btn-secondary" onClick={handleRemoveAvatar}>
                    Remove Avatar
                  </button>
                )}
              </div>

            </form>

            <nav className="profile-nav">
              {['library', 'orders', 'wishlist', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  className={`profile-nav-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              {userInfo?.role === 'admin' && (
                <Link to="/admin" className="profile-nav-btn admin-link">
                  Admin Panel
                </Link>
              )}
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {activeTab === 'library' && <LibraryTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'wishlist' && <WishlistTab profile={profile} />}
            {activeTab === 'reviews' && <ReviewsTab profile={profile} />}
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/orders/user`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('[v0] fetchOrders error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  if (loading) return <Loader />;

  return (
    <div className="tab-content">
      <h2 className="tab-title">Order History</h2>
      {orders.length === 0 ? (
        <p className="empty-state">No orders yet. <Link to="/games" className="accent">Shop now!</Link></p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                <span className={`order-status status-${order.status}`}>{order.status}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="order-games">
                {order.games.map((item, i) => (
                  <span key={i} className="order-game-tag">{item.title} (x{item.quantity})</span>
                ))}
              </div>
              <div className="order-total">
                Total: <span className="accent">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryTab() {
  const { loading, purchasedGames, error } = useSelector((state) => state.orderLibrary || {
    loading: false,
    purchasedGames: [],
    error: null,
  });
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleInstallClick = (game) => {
    setSelectedGame(game);
    setIsInstallOpen(true);
  };

  const closeModal = () => {
    setIsInstallOpen(false);
    setSelectedGame(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="tab-content">
      <h2 className="tab-title">My Library</h2>
      {error && <p className="error-message">{error}</p>}
      {purchasedGames.length === 0 ? (
        <p className="empty-state">Your library is empty. <Link to="/games" className="accent">Buy a game to build your library.</Link></p>
      ) : (
        <div className="games-grid library-grid">
          {purchasedGames.map((game) => (
            <div key={game.gameId} className="library-card">
              <img
                className="library-card-image"
                src={game.image || 'https://placehold.co/200x120/0a0a1a/00d4ff?text=Game'}
                alt={game.title || 'Purchased game'}
                onError={(e) => { e.target.src = 'https://placehold.co/200x120/0a0a1a/00d4ff?text=Game'; }}
              />
              <div className="library-card-body">
                <h3 className="library-card-title">{game.title || 'Untitled Game'}</h3>
                <button type="button" className="btn btn-primary btn-install" onClick={() => handleInstallClick(game)}>
                  Install
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isInstallOpen && (
        <div className="modal-backdrop">
          <div className="confirm-modal install-modal">
            <div className="confirm-modal-header">
              <h2>Install Game</h2>
            </div>
            <div className="confirm-modal-body">
              <p>
                Feature coming soon{selectedGame?.title ? ` for ${selectedGame.title}` : ''}.
                Your purchased game will be available here once install support is added.
              </p>
            </div>
            <div className="confirm-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistTab({ profile }) {
  return (
    <div className="tab-content">
      <h2 className="tab-title">Wishlist</h2>
      {!profile?.wishlist?.length ? (
        <p className="empty-state">Your wishlist is empty. <Link to="/games" className="accent">Browse games!</Link></p>
      ) : (
        <div className="games-grid">
          {profile.wishlist.map((game) => (
            <Link key={game._id || game} to={`/games/${game._id || game}`} className="wishlist-game-card">
              <img
                src={game.images?.[0] || 'https://placehold.co/120x80/0a0a1a/00d4ff?text=Game'}
                alt={game.title || 'Game'}
                onError={(e) => { e.target.src = 'https://placehold.co/120x80/0a0a1a/00d4ff?text=Game'; }}
              />
              <div>
                <p className="wishlist-game-title">{game.title}</p>
                {game.price !== undefined && (
                  <p className="accent">{game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ profile }) {
  return (
    <div className="tab-content">
      <h2 className="tab-title">My Reviews</h2>
      {!profile?.ratings?.length ? (
        <p className="empty-state">You have not rated any games yet.</p>
      ) : (
        <div className="reviews-list">
          {profile.ratings.map((r) => (
            <div key={r._id} className="review-card">
              <Link to={`/games/${r.gameId?._id || r.gameId}`} className="accent">
                {/* Get game title from ratings gameId */}
                {r.gameId?.title || 'Game Title'}
              </Link>
              <StarRating rating={r.rating} />
              {profile.comments.find((c) => c.gameId?._id?.toString() === r.gameId?._id?.toString()) && (
                <p>{profile.comments.find((c) => c.gameId?._id?.toString() === r.gameId?._id?.toString()).text}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
