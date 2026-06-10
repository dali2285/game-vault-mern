const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getPurchasedGames } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/user/library', protect, getPurchasedGames);
router.get('/admin', protect, adminOnly, getAllOrders);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
