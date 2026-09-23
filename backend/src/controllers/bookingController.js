const Booking = require('../models/Booking');
const {
  sendAppointmentConfirmationEmail,
  sendAppointmentRescheduledEmail,
  sendAppointmentReminderEmail,
} = require('../services/emailService');

// @desc    Get booked time slots for a given date
// @route   GET /api/bookings/booked-slots
// @access  Public
const getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date query param is required' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    }).select('time');

    const bookedSlots = bookings.map((b) => b.time);

    res.status(200).json({
      success: true,
      date,
      bookedSlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      serviceType,
      serviceName,
      date,
      time,
      duration,
      clientDetails,
      notes,
      amount,
    } = req.body;

    // Check if slot on given date is already booked by another user
    const bookingDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      time: time || '10:00 AM',
      status: { $ne: 'cancelled' },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `The ${time || 'selected'} time slot on this date is already booked. Please choose another time slot.`,
      });
    }

    const booking = await Booking.create({
      user: req.user ? req.user._id : undefined,
      serviceType: serviceType || 'birth-chart',
      serviceName: serviceName || 'Astrology Consultation',
      date: bookingDate,
      time: time || '10:00 AM',
      duration: duration || '60 mins',
      clientDetails: {
        ...clientDetails,
        name: clientDetails?.name || (req.user ? req.user.name : 'Guest Client'),
        email: clientDetails?.email || (req.user ? req.user.email : ''),
        phone: clientDetails?.phone || (req.user ? req.user.phone : ''),
      },
      notes: notes || '',
      amount: amount || 0,
    });

    const populatedBooking = booking.user
      ? await Booking.findById(booking._id).populate('user', 'name email phone')
      : booking;

    // Send confirmation email asynchronously (do not block API response)
    sendAppointmentConfirmationEmail(populatedBooking).catch((emailErr) => {
      console.error('Failed to dispatch appointment confirmation email:', emailErr);
    });

    res.status(201).json({
      success: true,
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.serviceType) filter.serviceType = req.query.serviceType;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is authorized
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      'pending',
      'pending_appointment',
      'confirmed',
      'ongoing',
      'follow-up',
      'follow_up',
      'completed',
      'cancelled',
      'rescheduled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is authorized
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reschedule booking
// @route   PUT /api/bookings/:id/reschedule
// @access  Private/Admin
const rescheduleBooking = async (req, res) => {
  try {
    const { date, time, notes, status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization: allow booking owner or admin
    const isOwner = booking.user && booking.user.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reschedule this booking',
      });
    }

    // Check slot availability for the newly selected date & time
    if (date || time) {
      const targetDate = date ? new Date(date) : booking.date;
      const targetTime = time || booking.time;

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const conflict = await Booking.findOne({
        _id: { $ne: booking._id },
        date: { $gte: startOfDay, $lte: endOfDay },
        time: targetTime,
        status: { $nin: ['cancelled', 'completed'] },
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: `The ${targetTime} slot on this date is already booked. Please choose another time slot.`,
        });
      }
    }

    if (date) {
      booking.date = new Date(date);
    }
    if (time) {
      booking.time = time;
    }
    if (notes !== undefined) {
      booking.notes = notes;
    }
    if (status) {
      booking.status = status;
    } else {
      booking.status = 'rescheduled';
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id).populate('user', 'name email phone');

    // Trigger rescheduled email notification asynchronously
    sendAppointmentRescheduledEmail(updatedBooking).catch((emailErr) => {
      console.error('Failed to dispatch appointment rescheduled email:', emailErr);
    });

    res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Send appointment reminder
// @route   POST /api/bookings/:id/reminder
// @access  Private
const sendBookingReminder = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email phone');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const isOwner = booking.user && booking.user._id.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send reminder for this booking',
      });
    }

    const sent = await sendAppointmentReminderEmail(booking);
    if (!sent) {
      return res.status(400).json({
        success: false,
        message: 'Failed to send reminder email. Please verify SendGrid configuration.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reminder email dispatched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBookedSlots,
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  rescheduleBooking,
  getUserBookings,
  sendBookingReminder,
};