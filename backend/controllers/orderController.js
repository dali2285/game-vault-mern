const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { games, totalPrice, paymentMethod } = req.body;

    if (!games || games.length === 0) {
      return res.status(400).json({ message: 'No games in order' });
    }

    const order = await Order.create({
      user: req.user._id,
      games,
      totalPrice,
      paymentMethod: paymentMethod || 'card',
    });

    // Clear cart after order
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(201).json(order);
  } catch (err) {
    console.error('[v0] createOrder error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('games.game', 'title images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('[v0] getUserOrders error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('games.game', 'title')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('[v0] getAllOrders error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('[v0] updateOrderStatus error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get purchased games from completed orders
// @route   GET /api/orders/user/library
const getPurchasedGames = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, status: 'completed' }).populate('games.game', 'title images price');

    const purchasedGamesMap = new Map();

    orders.forEach((order) => {
      order.games.forEach((item) => {
        const gameId = item.game?._id?.toString() || item._id?.toString();
        if (!gameId) return;

        if (!purchasedGamesMap.has(gameId)) {
          purchasedGamesMap.set(gameId, {
            gameId,
            title: item.game?.title || item.title,
            image: item.game?.images?.[0] || item.image || null,
            price: item.game?.price || item.price,
            quantity: item.quantity,
            purchasedAt: order.createdAt,
            orderId: order._id,
          });
        }
      });
    });

    res.json(Array.from(purchasedGamesMap.values()));
  } catch (err) {
    console.error('[v0] getPurchasedGames error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getPurchasedGames };
