const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  phone: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  timeOfBirth: {
    type: String,
  },
  placeOfBirth: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'customer'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationOTP: {
    type: String,
    default: null,
  },
  verificationOTPExpires: {
    type: Date,
    default: null,
  },
  addresses: [
    {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      isDefault: {
        type: Boolean,
        default: false,
      },
    },
  ],
  profileImage: {
    type: String,
    default: '',
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  cart: [
    {
      id: String,
      name: String,
      price: mongoose.Schema.Types.Mixed,
      image: String,
      category: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);