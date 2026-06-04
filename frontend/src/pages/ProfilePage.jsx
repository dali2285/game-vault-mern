import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../redux/actions/authActions';
import { listMyOrders } from '../../redux/actions/orderActions';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';

function ProfilePage() {
  const dispatch = useDispatch();
  const { userInfo, profile, loading } = useSelector((state) => state.auth);
  const { loading: ordersLoading } = useSelector((state) => ({
    loading: false,
    orders: [],
    // ...useSelector((s) => s.gamesList),
  }));
  console.log('[v0] ProfilePage render:', { userInfo, profile, loading, ordersLoading });

  const [activeTab, setActiveTab] = useState('orders');
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    dispatch(getProfile());
    // import('../../redux/actions/orderActions').then(({ listMyOrders }) => {
      dispatch(listMyOrders());
    // });
  }, [dispatch]);

  // We'll use a local order state from a sub-selector
  // const orderState = useSelector((state) => {
  //   return { orders: state.gamesList?.orders || [], loading: false };
  // });

  return (
    <div className="page profile-page">
      <h1 className="page-title">My <span className="accent">Profile</span></h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {userInfo?.name?.charAt(0).toUpperCase()}
              </div>
              <h3>{userInfo?.name}</h3>
              <p>{userInfo?.email}</p>
              {userInfo?.role === 'admin' && (
                <span className="role-badge">Admin</span>
              )}
            </div>
            <nav className="profile-nav">
              {['orders', 'wishlist', 'reviews'].map((tab) => (
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
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  const axios = window._axios;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/user', {
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
                {/* Get game title from ratings gameId */ }
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
