const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  shortDescription: {
    type: String,
    maxlength: 200,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  images: [{
    type: String,
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: String,
    enum: ['Best Seller', 'New', 'Popular', 'Sacred', 'Limited', 'Handmade', ''],
    default: '',
  },
  features: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Auto-generate slug from name — runs BEFORE validation
productSchema.pre('validate', function(next) {
  if (this.isNew || this.isModified('name')) {
    const base = this.name
      ? this.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : 'product';
    this.slug = `${base}-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);