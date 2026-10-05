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
const {
  getAdminVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  toggleVideoStatus,
  toggleVideoFeatured,
  reorderVideos,
} = require('../controllers/videoController');
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

// YouTube Video Management
router.get('/videos', getAdminVideos);
router.get('/videos/:id', getVideoById);
router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', deleteVideo);
router.patch('/videos/reorder', reorderVideos);
router.patch('/videos/:id/status', toggleVideoStatus);
router.patch('/videos/:id/featured', toggleVideoFeatured);

module.exports = router;