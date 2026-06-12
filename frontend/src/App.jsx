import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { loadCart } from '../redux/actions/cartActions';
import { getProfile } from '../redux/actions/authActions';
import { listPurchasedGames } from '../redux/actions/orderActions';

import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import GameDetailPage from './pages/GameDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGames from './pages/admin/AdminGames';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import GameFormPage from './pages/admin/GameFormPage';

function App() {
  const dispatch = useDispatch();
  const { userInfo, profile } = useSelector((state) => state.auth);
  const { loaded: libraryLoaded } = useSelector((state) => state.orderLibrary || { loaded: false });

  useEffect(() => {
    if (userInfo) {
      dispatch(loadCart());
      if (!profile) {
        dispatch(getProfile());
      }
      if (!libraryLoaded) {
        dispatch(listPurchasedGames());
      }
    }
  }, [dispatch, userInfo, profile, libraryLoaded]);

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/:id" element={<GameDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/games" element={<AdminRoute><AdminGames /></AdminRoute>} />
              <Route path="/admin/games/new" element={<AdminRoute><GameFormPage /></AdminRoute>} />
              <Route path="/admin/games/edit/:id" element={<AdminRoute><GameFormPage /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
