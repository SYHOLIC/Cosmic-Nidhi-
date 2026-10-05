const mongoose = require('mongoose');

const VIDEO_CATEGORIES = [
  'Astrology',
  'Vedic Astrology',
  'Numerology',
  'Tarot Reading',
  'Horoscope',
  'Zodiac Signs',
  'Love & Relationship',
  'Career & Finance',
  'Marriage',
  'Planetary Analysis',
  'Spiritual Guidance',
  'Daily Horoscope',
  'Weekly Horoscope',
  'Monthly Horoscope',
  'Festival / Special',
  'Other',
];

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a video title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    youtube_url: {
      type: String,
      required: [true, 'Please provide a YouTube URL'],
      trim: true,
    },
    youtube_video_id: {
      type: String,
      required: [true, 'YouTube video ID could not be extracted'],
      trim: true,
      index: true,
    },
    thumbnail_url: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: VIDEO_CATEGORIES,
      default: 'Astrology',
      index: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    is_featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    display_order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method on schema or export categories
videoSchema.statics.CATEGORIES = VIDEO_CATEGORIES;

module.exports = mongoose.model('Video', videoSchema);
