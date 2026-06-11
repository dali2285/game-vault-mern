import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled'];

function AdminOrders() {
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders/admin`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await fetch(`${API}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error('[v0] updateStatus error:', err);
    }
  };

  return (
    <div className="page admin-page">
      <div className="admin-page-header">
        <h1 className="page-title">Manage <span className="accent">Orders</span></h1>
        <Link to="/admin" className="btn-outline">Back to Dashboard</Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : orders.length === 0 ? (
        <Message type="info">No orders yet.</Message>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Games</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id-cell" data-label="Order ID">#{order._id.slice(-8).toUpperCase()}</td>
                  <td data-label="User">
                    <div>{order.user?.name}</div>
                    <small>{order.user?.email}</small>
                  </td>
                  <td data-label="Games">
                    {order.games.map((g, i) => (
                      <span key={i} className="order-game-tag">{g.title} (x{g.quantity})</span>
                    ))}
                  </td>
                  <td className="accent" data-label="Total">${order.totalPrice.toFixed(2)}</td>
                  <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td data-label="Status">
                    <select
                      className={`status-select status-${order.status}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
