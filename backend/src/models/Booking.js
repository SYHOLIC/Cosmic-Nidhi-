const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  serviceType: {
    type: String,
    enum: [
      'birth-chart',
      'numerology',
      'vastu',
      'vastu-visit',
      'vastu-gridding',
      'kundli-matching',
      'career-guidance',
      'muhurat',
      'annual-guidance',
    ],
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending',
  },
  clientDetails: {
    name: String,
    email: String,
    phone: String,
    dateOfBirth: String,
    timeOfBirth: String,
    placeOfBirth: String,
    questions: String,
  },
  notes: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  amount: {
    type: Number,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);