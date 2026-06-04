const express = require('express');
const router = express.Router();
const { createReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/:gameId', getReviews);

module.exports = router;
