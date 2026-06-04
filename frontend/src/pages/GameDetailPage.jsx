import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGameDetails } from '../../redux/actions/gameActions';
import { addToCart } from '../../redux/actions/cartActions';
import { createReview } from '../../redux/actions/reviewActions';
import { toggleWishlist } from '../../redux/actions/authActions';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import Message from '../components/Message';

function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { game, loading, error } = useSelector((state) => state.gameDetail);
  const { userInfo, profile } = useSelector((state) => state.auth);
  const { loading: reviewLoading, success: reviewSuccess, error: reviewError } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [reviewMsg, setReviewMsg] = useState('');

  const isWishlisted = profile?.wishlist?.some((wId) =>
    (typeof wId === 'object' ? wId._id : wId) === id
  );

  useEffect(() => {
    dispatch(getGameDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (reviewSuccess) {
      setReviewMsg('Review submitted successfully!');
      setRating(0);
      setComment('');
      setTimeout(() => setReviewMsg(''), 3000);
    }
  }, [reviewSuccess]);

  const handleAddToCart = () => {
    if (!userInfo) { navigate('/login'); return; }
    dispatch(addToCart(id));
  };

  const handleWishlist = () => {
    if (!userInfo) { navigate('/login'); return; }
    dispatch(toggleWishlist(id));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    dispatch(createReview(id, rating, comment));
  };

  if (loading) return <Loader />;
  if (error) return <div className="page"><Message type="error">{error}</Message></div>;
  if (!game) return null;

  const images = game.images?.length > 0 ? game.images : ['https://placehold.co/600x400/0a0a1a/00d4ff?text=No+Image'];

  return (
    <div className="page game-detail-page">
      {/* <button className="btn-outline" onClick={() => navigate(-1)}>
        ← Back
      </button> */}
      <div className="game-detail-grid">
        {/* Images */}
        <div className="game-images">
          <div className="game-main-image">
            <img
              src={images[activeImage]}
              alt={game.title}
              onError={(e) => { e.target.src = 'https://placehold.co/600x400/0a0a1a/00d4ff?text=No+Image'; }}
            />
          </div>
          {images.length > 1 && (
            <div className="game-thumbnails">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${game.title} ${i + 1}`}
                  className={`thumbnail ${activeImage === i ? 'active' : ''}`}
                  onClick={() => setActiveImage(i)}
                  onError={(e) => { e.target.src = 'https://placehold.co/80x60/0a0a1a/00d4ff?text=Img'; }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="game-info">
          <span className="game-category-badge">{game.category}</span>
          <h1 className="game-title">{game.title}</h1>
          <div className="game-meta">
            <StarRating rating={game.rating} />
            <span className="review-count">({game.numReviews} reviews)</span>
          </div>
          <p className="game-description">{game.description}</p>
          <div className="game-price-row">
            <span className="game-price-large">
              {game.price === 0 ? 'Free to Play' : `$${game.price.toFixed(2)}`}
            </span>
          </div>
          <div className="game-actions">
            <button className="btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2 className="section-title">Reviews <span className="accent">& Ratings</span></h2>

        {/* Review Form */}
        {userInfo ? (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h3>Write a Review</h3>
            {reviewMsg && <Message type="success">{reviewMsg}</Message>}
            {reviewError && <Message type="error">{reviewError}</Message>}
            <div className="form-group">
              <label>Your Rating</label>
              <StarRating rating={rating} interactive onRate={setRating} />
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                className="form-textarea"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={reviewLoading || !rating}>
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <Message type="info">
            <a href="/login" className="accent">Login</a> to write a review.
          </Message>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          {game.reviews?.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            game.reviews?.map((rev) => (
              <div key={rev._id} className="review-card">
                <div className="review-header">
                  <span className="review-author">{rev.name}</span>
                  <StarRating rating={rev.rating} />
                  <span className="review-date">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-comment">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default GameDetailPage;
