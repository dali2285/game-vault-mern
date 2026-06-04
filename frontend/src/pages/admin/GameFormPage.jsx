import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createGame, updateGame, getGameDetails } from '../../../redux/actions/gameActions';
import { GAME_CREATE_RESET, GAME_UPDATE_RESET } from '../../../redux/constants';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useToast } from '../../components/Toast';

const CATEGORIES = ['Action', 'RPG', 'Sports', 'Shooter', 'Open World', 'Sandbox', 'Battle Royale', 'Adventure', 'Simulation'];

function GameFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { game, loading: detailLoading } = useSelector((state) => state.gameDetail);
  const { loading: createLoading, success: createSuccess, error: createError } = useSelector((state) => state.gameCreate);
  const { loading: updateLoading, success: updateSuccess, error: updateError } = useSelector((state) => state.gameUpdate);
  const { showToast } = useToast();

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Action',
    images: '',
  });

  useEffect(() => {
    dispatch({ type: GAME_CREATE_RESET });
    dispatch({ type: GAME_UPDATE_RESET });
  }, [dispatch]);

  useEffect(() => {
    if (isEdit) {
      dispatch(getGameDetails(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && game && game._id === id) {
      setForm({
        title: game.title,
        description: game.description,
        price: game.price,
        category: game.category,
        images: game.images?.join(', ') || '',
      });
    }
  }, [game, isEdit, id]);

  useEffect(() => {
    if (!submitted) return;

    if (createSuccess) {
      showToast('Game created successfully', 'success');
      navigate('/admin/games');
    } else if (updateSuccess) {
      showToast('Game updated successfully', 'success');
      navigate('/admin/games');
    }
  }, [createSuccess, updateSuccess, navigate, submitted, showToast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const gameData = {
      ...form,
      price: Number(form.price),
      images: form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setSubmitted(true);
    if (isEdit) {
      dispatch(updateGame(id, gameData));
    } else {
      dispatch(createGame(gameData));
    }
  };

  if (isEdit && detailLoading) return <Loader />;

  return (
    <div className="page admin-page">
      <div className="admin-page-header">
        <h1 className="page-title">
          {isEdit ? 'Edit' : 'Add'} <span className="accent">Game</span>
        </h1>
        <Link to="/admin" className="btn-outline">Back to Dashboard</Link>
      </div>

      {(createError || updateError) && (
        <Message type="error">{createError || updateError}</Message>
      )}

      <form className="game-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Game title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            rows={5}
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Game description..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-input"
              value={form.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="images">Image URLs (comma separated)</label>
          <input
            id="images"
            name="images"
            type="text"
            className="form-input"
            value={form.images}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={createLoading || updateLoading}
          >
            {createLoading || updateLoading ? 'Saving...' : isEdit ? 'Update Game' : 'Create Game'}
          </button>
          <button type="button" className="btn-outline" onClick={() => navigate('/admin/games')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default GameFormPage;
