const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getOrders,
  getBookings,
  getNotifications,
} = require('../controllers/adminController');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

// All routes require admin access
router.use(protect, admin);

// Stats & Users
router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Orders, Bookings & Notifications
router.get('/orders', getOrders);
router.get('/bookings', getBookings);
router.get('/notifications', getNotifications);

// Categories (reuse existing controller)
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;