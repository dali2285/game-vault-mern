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
    imageUrls: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

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
        imageUrls: game.images?.join(', ') || '',
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        showToast(`${file.name} is not a valid image format`, 'error');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} is larger than 5MB`, 'error');
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);

    // Create previews
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse image URLs
    const imageUrls = form.imageUrls
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Create FormData if there are files
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', Number(form.price));
      formData.append('category', form.category);
      
      // Add image URLs to FormData
      if (imageUrls.length > 0) {
        formData.append('imageUrls', imageUrls.join(','));
      }
      
      // Add files
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      setSubmitted(true);
      if (isEdit) {
        dispatch(updateGame(id, formData));
      } else {
        dispatch(createGame(formData));
      }
    } else {
      // No files, send regular JSON
      const gameData = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        imageUrls: imageUrls,
      };
      setSubmitted(true);
      if (isEdit) {
        dispatch(updateGame(id, gameData));
      } else {
        dispatch(createGame(gameData));
      }
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
          <label htmlFor="imageUrls">Image URLs (comma separated)</label>
          <input
            id="imageUrls"
            name="imageUrls"
            type="text"
            className="form-input"
            value={form.imageUrls}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>
            You can add both URLs and upload files below
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="imageFiles">Upload Images from PC (max 5 files, 5MB each)</label>
          <input
            id="imageFiles"
            name="imageFiles"
            type="file"
            className="form-input"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            style={{ padding: '10px', cursor: 'pointer' }}
          />
          <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>
            Supported formats: JPG, PNG, GIF, WebP
          </small>
        </div>

        {selectedFiles.length > 0 && (
          <div className="form-group">
            <label>Selected Images ({selectedFiles.length})</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {filePreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'rgba(255, 0, 0, 0.8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
