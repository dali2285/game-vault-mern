const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, toggleWishlist, getStats } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getUsers);
router.delete('/:id', protect, adminOnly, deleteUser);
router.post('/wishlist', protect, toggleWishlist);

module.exports = router;
