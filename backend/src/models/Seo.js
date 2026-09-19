const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true,
    unique: true,
    trim: true, // e.g. "home", "shop", "cart"
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  keywords: {
    type: String, // comma separated
  },
}, { timestamps: true });

module.exports = mongoose.model('Seo', seoSchema);
