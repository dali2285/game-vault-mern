import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../components/Toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AdminUsers() {
  const { userInfo } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedId, setDeletedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, name: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/users`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [deletedId]);

  const handleDelete = (id, name) => {
    setConfirmDelete({ isOpen: true, id, name });
  };

  const closeDeleteModal = () => {
    setConfirmDelete({ isOpen: false, id: null, name: '' });
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`${API}/users/${confirmDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setDeletedId(confirmDelete.id);
      showToast('User deleted successfully', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="page admin-page">
      <div className="admin-page-header">
        <h1 className="page-title">Manage <span className="accent">Users</span></h1>
        <Link to="/admin" className="btn-outline">Back to Dashboard</Link>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title={`Delete user "${confirmDelete.name}"?`}
        message="This user will be permanently removed."
        confirmText="Delete"
        destructive
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role === 'admin' ? 'admin' : ''}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user._id, user.name)}
                      >
                        Delete
                      </button>
                    )}
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

export default AdminUsers;
