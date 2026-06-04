import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadCart, removeFromCart, updateCartItem } from '../../redux/actions/cartActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) dispatch(loadCart());
  }, [dispatch, userInfo]);

  const total = cartItems.reduce((sum, item) => sum + item.game.price * item.quantity, 0);

  const handleRemove = (gameId) => {
    dispatch(removeFromCart(gameId));
  };

  const handleQty = (gameId, qty) => {
    dispatch(updateCartItem(gameId, qty));
  };

  if (loading) return <Loader />;

  return (
    <div className="page cart-page">
      <h1 className="page-title">Shopping <span className="accent">Cart</span></h1>

      {error && <Message type="error">{error}</Message>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">&#128722;</div>
          <h2>Your cart is empty</h2>
          <p>Browse our collection and add some games!</p>
          <Link to="/games" className="btn-primary">Browse Games</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.game.images?.[0] || 'https://placehold.co/80x80/0a0a1a/00d4ff?text=Game'}
                  alt={item.game.title}
                  className="cart-item-image"
                  onError={(e) => { e.target.src = 'https://placehold.co/80x80/0a0a1a/00d4ff?text=Game'; }}
                />
                <div className="cart-item-info">
                  <Link to={`/games/${item.game._id}`} className="cart-item-title">
                    {item.game.title}
                  </Link>
                  <span className="cart-item-price">${item.game.price.toFixed(2)}</span>
                </div>
                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => handleQty(item.game._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleQty(item.game._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="cart-item-subtotal">
                  ${(item.game.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemove(item.game._id)}
                  aria-label="Remove item"
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Items ({cartItems.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span className="accent">${total.toFixed(2)}</span>
            </div>
            <button
              className="btn-primary btn-full"
              onClick={() => navigate('/checkout')}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            <Link to="/games" className="btn-outline btn-full" style={{ textAlign: 'center', display: 'block', marginTop: '0.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
