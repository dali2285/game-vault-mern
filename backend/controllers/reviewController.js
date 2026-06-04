const Game = require('../models/Game');
const User = require('../models/User');

// @desc    Create/update review
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { gameId, rating, comment } = req.body;

    if (!gameId || !rating || !comment) {
      return res.status(400).json({ message: 'gameId, rating and comment are required' });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    // Check if user already reviewed
    const alreadyReviewed = game.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = comment;
    } else {
      game.reviews.push({
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      });
    }

    game.numReviews = game.reviews.length;
    game.rating =
      game.reviews.reduce((acc, r) => acc + r.rating, 0) / game.reviews.length;

    await game.save();

    // Also save to user's ratings/comments
    const user = await User.findById(req.user._id);
    const existingRating = user.ratings.find((r) => r.gameId.toString() === gameId);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      user.ratings.push({ gameId, rating });
    }
    const existingComment = user.comments.find((c) => c.gameId.toString() === gameId);
    if (existingComment) {
      existingComment.text = comment;
    } else {
      user.comments.push({ gameId, text: comment });
    }
    await user.save();

    res.status(201).json({ message: 'Review submitted', game });
  } catch (err) {
    console.error('[v0] createReview error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reviews for a game
// @route   GET /api/reviews/:gameId
const getReviews = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId).populate('reviews.user', 'name');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game.reviews);
  } catch (err) {
    console.error('[v0] getReviews error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createReview, getReviews };
