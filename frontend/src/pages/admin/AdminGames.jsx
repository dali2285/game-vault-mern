import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listGames, deleteGame } from '../../../redux/actions/gameActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../components/Toast';

function AdminGames() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { games, loading, error } = useSelector((state) => state.gamesList);
  const { success: deleteSuccess } = useSelector((state) => state.gameDelete);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, title: '' });

  useEffect(() => {
    dispatch(listGames('', 'All', '', 1));
  }, [dispatch, deleteSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      showToast('Game deleted successfully', 'success');
    }
  }, [deleteSuccess, showToast]);

  const handleDelete = (id, title) => {
    setConfirmDelete({ isOpen: true, id, title });
  };

  const closeDeleteModal = () => {
    setConfirmDelete({ isOpen: false, id: null, title: '' });
  };

  const handleConfirmDelete = () => {
    dispatch(deleteGame(confirmDelete.id));
    closeDeleteModal();
  };

  return (
    <div className="page admin-page">
      <div className="admin-page-header">
        <h1 className="page-title">Manage <span className="accent">Games</span></h1>
        <div className="action-btns">
          <Link to="/admin" className="btn-outline">Back to Dashboard</Link>
          <Link to="/admin/games/new" className="btn-primary">+ Add Game</Link>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title={`Delete "${confirmDelete.title}"?`}
        message="This action cannot be undone."
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
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td>
                    <img
                      src={game.images?.[0] || 'https://placehold.co/60x40/0a0a1a/00d4ff?text=Game'}
                      alt={game.title}
                      className="admin-game-thumb"
                      onError={(e) => { e.target.src = 'https://placehold.co/60x40/0a0a1a/00d4ff?text=Game'; }}
                    />
                  </td>
                  <td>{game.title}</td>
                  <td><span className="category-tag">{game.category}</span></td>
                  <td>{game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`}</td>
                  <td>{game.rating.toFixed(1)} &#9733;</td>
                  <td className="action-btns">
                    <Link to={`/admin/games/edit/${game._id}`} className="btn-edit">Edit</Link>
                    <button className="btn-delete" onClick={() => handleDelete(game._id, game.title)}>
                      Delete
                    </button>
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

export default AdminGames;
