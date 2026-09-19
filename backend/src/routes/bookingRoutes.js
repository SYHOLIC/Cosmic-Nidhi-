const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getUserBookings,
} = require('../controllers/bookingController');
const { protect, optionalProtect, admin } = require('../middleware/auth');

// User routes
router.post('/', optionalProtect, createBooking);
router.get('/my-bookings', protect, getUserBookings);

// Admin routes
router.get('/', protect, admin, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;