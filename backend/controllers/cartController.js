const User = require('../models/User');

// @desc    Get cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.game', 'title price images rating');
    res.json(user.cart);
  } catch (err) {
    console.error('[v0] getCart error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add to cart
// @route   POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { gameId, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find((item) => item.game.toString() === gameId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ game: gameId, quantity });
    }

    await user.save();
    await user.populate('cart.game', 'title price images rating');
    res.json(user.cart);
  } catch (err) {
    console.error('[v0] addToCart error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove from cart
// @route   POST /api/cart/remove
const removeFromCart = async (req, res) => {
  try {
    const { gameId } = req.body;
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((item) => item.game.toString() !== gameId);
    await user.save();
    await user.populate('cart.game', 'title price images rating');
    res.json(user.cart);
  } catch (err) {
    console.error('[v0] removeFromCart error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { gameId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.find((item) => item.game.toString() === gameId);
    if (item) {
      if (quantity <= 0) {
        user.cart = user.cart.filter((item) => item.game.toString() !== gameId);
      } else {
        item.quantity = quantity;
      }
    }
    await user.save();
    await user.populate('cart.game', 'title price images rating');
    res.json(user.cart);
  } catch (err) {
    console.error('[v0] updateCartItem error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json([]);
  } catch (err) {
    console.error('[v0] clearCart error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCartItem, clearCart };
