import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../redux/actions/orderActions';
import { CART_CLEAR } from '../../redux/constants';
import Message from '../components/Message';

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { loading: orderLoading, error: orderError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [success, setSuccess] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.game.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const games = cartItems.map((item) => ({
      game: item.game._id,
      title: item.game.title,
      price: item.game.price,
      quantity: item.quantity,
      image: item.game.images?.[0] || '',
    }));

    await dispatch(createOrder({ games, totalPrice: total, paymentMethod: 'card' }));
    dispatch({ type: CART_CLEAR });
    setSuccess(true);
    setTimeout(() => navigate('/profile'), 2500);
  };

  if (success) {
    return (
      <div className="page checkout-page">
        <div className="checkout-success">
          <div className="success-icon">&#10003;</div>
          <h2>Order Placed!</h2>
          <p>Your order has been successfully placed. Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <h1 className="page-title">Checkout</h1>

      {orderError && <Message type="error">{orderError}</Message>}

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3 className="form-section-title">Payment Details</h3>
          <div className="form-group">
            <label htmlFor="cardName">Name on Card</label>
            <input
              id="cardName"
              name="cardName"
              type="text"
              className="form-input"
              value={form.cardName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              className="form-input"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiry">Expiry Date</label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                className="form-input"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                name="cvv"
                type="text"
                className="form-input"
                value={form.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={orderLoading}>
            {orderLoading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3 className="summary-title">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="checkout-item">
              <span className="checkout-item-title">{item.game.title} x{item.quantity}</span>
              <span>${(item.game.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span className="accent">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
