const express = require('express');
const router = express.Router();
const {
  getBookedSlots,
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  rescheduleBooking,
  getUserBookings,
  sendBookingReminder,
} = require('../controllers/bookingController');
const { protect, optionalProtect, admin } = require('../middleware/auth');

// Public availability check
router.get('/booked-slots', getBookedSlots);

// User routes
router.post('/', optionalProtect, createBooking);
router.get('/my-bookings', protect, getUserBookings);

// Admin routes
router.get('/', protect, admin, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.put('/:id/reschedule', protect, rescheduleBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/:id/reminder', protect, sendBookingReminder);

module.exports = router;