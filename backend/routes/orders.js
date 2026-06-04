const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/admin', protect, adminOnly, getAllOrders);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
