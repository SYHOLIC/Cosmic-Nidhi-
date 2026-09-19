const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const seoRoutes = require('./routes/seoRoutes');
const pageRoutes = require('./routes/pageRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');
const contactRoutes = require('./routes/contactRoutes');

const errorHandler = require('./middleware/error');

const app = express();

// Middleware — INCREASED LIMIT FOR BASE64 IMAGES
app.use(cors({
  origin: function (origin, callback) { callback(null, true); },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));              // ← Changed
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // ← Changed

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/contact', contactRoutes);

// Sitemap
app.use('/sitemap.xml', sitemapRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cosmic Nidhi API is running' });
});

// Error handling
app.use(errorHandler);

module.exports = app;