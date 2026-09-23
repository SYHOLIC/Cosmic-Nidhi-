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
  numReviews: {
    type: Number,
    default: 0,
    min: 0,
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
  sku: {
    type: String,
    trim: true,
  },
  SKU: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Auto-generate slug and sku from name — runs BEFORE validation
productSchema.pre('validate', function(next) {
  if (!this.slug || this.isNew || this.isModified('name')) {
    const base = this.name
      ? this.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : 'product';
    this.slug = `${base}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  }

  if (!this.sku) {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.sku = `CN-${Date.now().toString(36).toUpperCase()}-${rand}`;
  }
  this.SKU = this.sku;

  if (Array.isArray(this.reviews)) {
    this.numReviews = this.reviews.length;
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);