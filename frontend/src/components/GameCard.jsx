import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/actions/cartActions';
import { toggleWishlist } from '../../redux/actions/authActions';
import StarRating from './StarRating';

function GameCard({ game }) {
  const dispatch = useDispatch();
  const { userInfo, profile } = useSelector((state) => state.auth);
  const isWishlisted = profile?.wishlist?.some((id) =>
    (typeof id === 'object' ? id._id : id) === game._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!userInfo) return;
    dispatch(addToCart(game._id));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!userInfo) return;
    dispatch(toggleWishlist(game._id));
  };

  const imageUrl = game.images?.[0] || 'https://placehold.co/300x200/0a0a1a/00d4ff?text=No+Image';

  return (
    <div className="game-card">
      <Link to={`/games/${game._id}`} className="game-card-link">
        <div className="game-card-image-wrap">
          <img
            src={imageUrl}
            alt={game.title}
            className="game-card-image"
            onError={(e) => { e.target.src = 'https://placehold.co/300x200/0a0a1a/00d4ff?text=No+Image'; }}
          />
          <span className="game-card-category">{game.category}</span>
          {userInfo && (
            <button
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? '♥' : '♡'}
            </button>
          )}
        </div>
        <div className="game-card-body">
          <h3 className="game-card-title">{game.title}</h3>
          <StarRating rating={game.rating} />
          <div className="game-card-footer">
            <span className="game-card-price">
              {game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`}
            </span>
            {userInfo && (
              <button className="btn-add-cart" onClick={handleAddToCart}>
                + Cart
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default GameCard;
