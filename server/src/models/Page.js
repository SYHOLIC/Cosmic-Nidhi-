const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // e.g. "about-us"
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true, // Rich text or markdown
  },
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
