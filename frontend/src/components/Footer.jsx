import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Footer() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/">
            <img src="/GameVault_Logo_v5.png" alt="GameVault logo" className="footer-logo-image" />
          </Link>
          <p>Your ultimate destination for the best games.</p>
        </div>
        <div className="footer-links">
          <h4>Navigate</h4>
          <Link to="/">Home</Link>
          <Link to="/games">Games</Link>
          {userInfo ? (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
        <div className="footer-links">
          <h4>Categories</h4>
          <Link to="/games?category=Action">Action</Link>
          <Link to="/games?category=RPG">RPG</Link>
          <Link to="/games?category=Sports">Sports</Link>
          <Link to="/games?category=Shooter">Shooter</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GameVault. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
