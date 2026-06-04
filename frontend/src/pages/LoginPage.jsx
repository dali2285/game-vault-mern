import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import { loadCart } from '../../redux/actions/cartActions';
import { getProfile } from '../../redux/actions/authActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userInfo) {
      dispatch(loadCart());
      dispatch(getProfile());
      navigate(userInfo.role === 'admin' ? '/admin' : '/');
    }
  }, [userInfo, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/GameVault_Logo_v5.png" alt="GameVault logo" className="auth-logo-image" />
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <Message type="error">{error}</Message>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <Loader size="sm" /> : 'Sign In'}
          </button>
        </form>

        <div className="auth-hint">
          <p>Demo credentials: <strong>admin@gamestore.com</strong> / admin123</p>
        </div>

        <p className="auth-switch">
          {"Don't have an account? "}
          <Link to="/register" className="accent">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
