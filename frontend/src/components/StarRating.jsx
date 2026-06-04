import React from 'react';

function StarRating({ rating, max = 5, interactive = false, onRate }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="star-rating" aria-label={`Rating: ${rating} out of ${max}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= Math.round(rating) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => onRate(star) : undefined}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `Rate ${star}` : undefined}
        >
          &#9733;
        </span>
      ))}
      {!interactive && (
        <span className="rating-value">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
}

export default StarRating;
