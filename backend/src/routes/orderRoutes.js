const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);

// Admin routes
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;