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

// SEO: Sitemap, Robots, Ads
app.use('/sitemap.xml', sitemapRoutes);
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.set('Cache-Control', 'public, max-age=86400');
  const baseUrl = process.env.FRONTEND_URL || 'https://cosmic-nidhi.onrender.com';
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nDisallow: /checkout\nDisallow: /cart\n\nSitemap: ${baseUrl}/sitemap.xml\nSitemap: https://cosmicnidhi.com/sitemap.xml\n`);
});
app.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send('# Cosmic Nidhi Ads.txt\n');
});
app.get('/llms.txt', (req, res) => {
  res.type('text/plain');
  res.set('Cache-Control', 'public, max-age=86400');
  const baseUrl = process.env.FRONTEND_URL || 'https://cosmic-nidhi.onrender.com';
  res.send(`# Cosmic Nidhi - Vedic Astrology & Vastu Consultation\n> Authentic Vedic astrology, personalized birth chart readings, applied Vastu consultations, and certified spiritual gemstones.\n\n## Overview\nCosmic Nidhi is a premier platform dedicated to authentic Vedic wisdom, personalized astrological analysis, and spatial energy alignment.\n\n## Key URLs\n- Homepage: ${baseUrl}/\n- Services: ${baseUrl}/services\n- Products: ${baseUrl}/products\n- Pitra Dosh Calculator: ${baseUrl}/pitra-dosh-calculator\n- Zodiac Index: ${baseUrl}/zodiac\n- About: ${baseUrl}/about\n- Contact: ${baseUrl}/contact\n`);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cosmic Nidhi API is running' });
});

// Error handling
app.use(errorHandler);

module.exports = app;