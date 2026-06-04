import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';

function AdminDashboard() {
  const { userInfo } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/stats', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('[v0] fetchStats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userInfo]);

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1 className="page-title">Admin <span className="accent">Dashboard</span></h1>
        <p className="admin-subtitle">Welcome back, {userInfo?.name}</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon games-icon">&#127918;</div>
            <div>
              <p className="stat-card-label">Total Games</p>
              <p className="stat-card-value">{stats?.totalGames || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon users-icon">&#128101;</div>
            <div>
              <p className="stat-card-label">Total Users</p>
              <p className="stat-card-value">{stats?.totalUsers || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon orders-icon">&#128230;</div>
            <div>
              <p className="stat-card-label">Total Orders</p>
              <p className="stat-card-value">{stats?.totalOrders || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon revenue-icon">&#128178;</div>
            <div>
              <p className="stat-card-label">Revenue</p>
              <p className="stat-card-value">${(stats?.revenue || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="admin-quick-links">
        <h2 className="section-title">Quick <span className="accent">Actions</span></h2>
        <div className="quick-links-grid">
          <Link to="/admin/games" className="quick-link-card">
            <span className="ql-icon">&#127918;</span>
            <span>Manage Games</span>
          </Link>
          <Link to="/admin/games/new" className="quick-link-card accent-card">
            <span className="ql-icon">&#43;</span>
            <span>Add New Game</span>
          </Link>
          <Link to="/admin/users" className="quick-link-card">
            <span className="ql-icon">&#128101;</span>
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/orders" className="quick-link-card">
            <span className="ql-icon">&#128230;</span>
            <span>View Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
