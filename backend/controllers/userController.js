const User = require('../models/User');

// @desc    Get all users (admin)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('[v0] getUsers error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error('[v0] deleteUser error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle wishlist
// @route   POST /api/users/wishlist
const toggleWishlist = async (req, res) => {
  try {
    const { gameId } = req.body;
    const user = await User.findById(req.user._id);
    const index = user.wishlist.findIndex((id) => id.toString() === gameId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(gameId);
    }
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    console.error('[v0] toggleWishlist error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user stats (admin dashboard)
// @route   GET /api/users/stats
const getStats = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const Game = require('../models/Game');
    const [totalUsers, totalGames, totalOrders, orders] = await Promise.all([
      User.countDocuments(),
      Game.countDocuments(),
      Order.countDocuments(),
      Order.find({}),
    ]);
    const revenue = orders
      .filter((o) => o.status == 'completed')
      .reduce((sum, o) => sum + o.totalPrice, 0);
    res.json({ totalUsers, totalGames, totalOrders, revenue });
  } catch (err) {
    console.error('[v0] getStats error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUsers, deleteUser, toggleWishlist, getStats };
