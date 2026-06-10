import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { useToast } from './Toast';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { userInfo, profile } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const avatarUrl = profile?.avatarUrl || userInfo?.avatarUrl;
  const displayName = userInfo?.name || profile?.name || 'Account';
  const initials = (displayName || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    showToast('Logout successful', 'success');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/">
          <img src="/GameVault_Logo_v5.png" alt="GameVault logo" className="navbar-logo-image" />
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </button>

          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/games" className="nav-link" onClick={() => setMenuOpen(false)}>Games</Link>
          
          {userInfo ? (
            <>
              <Link to="/cart" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="nav-dropdown">
                <button
                  className="nav-link dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="User avatar" className="nav-avatar" />
                  ) : (
                    <span className="nav-avatar-placeholder">{initials}</span>
                  )}
                  {displayName} &#9660;
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      My Profile
                    </Link>
                    {userInfo.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item admin-link" onClick={() => setDropdownOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-btn" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
