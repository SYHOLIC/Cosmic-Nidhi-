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
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));



// Routes (mounted at both /api/* and /* for full compatibility with all client environments)
const mountRoute = (path, handler) => {
  app.use(`/api${path}`, handler);
  app.use(path, handler);
};

mountRoute('/auth', authRoutes);
mountRoute('/users', userRoutes);
mountRoute('/products', productRoutes);
mountRoute('/categories', categoryRoutes);
mountRoute('/orders', orderRoutes);
mountRoute('/bookings', bookingRoutes);
mountRoute('/payment', paymentRoutes);

// Direct Razorpay Standard Checkout endpoints (/api/create-order and /api/verify-payment)
const { createRazorpayOrder, verifyPayment } = require('./controllers/paymentController');
const { optionalProtect } = require('./middleware/auth');
app.post('/api/create-order', optionalProtect, createRazorpayOrder);
app.post('/create-order', optionalProtect, createRazorpayOrder);
app.post('/api/verify-payment', optionalProtect, verifyPayment);
app.post('/verify-payment', optionalProtect, verifyPayment);
mountRoute('/admin', adminRoutes);
mountRoute('/coupons', couponRoutes);
mountRoute('/reviews', reviewRoutes);
mountRoute('/seo', seoRoutes);
mountRoute('/pages', pageRoutes);
mountRoute('/contact', contactRoutes);

// SEO: Sitemap, Robots, Ads
app.use('/sitemap.xml', sitemapRoutes);
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.set('Cache-Control', 'public, max-age=86400');
  const baseUrl = process.env.FRONTEND_URL || 'https://cosmicnidhi-front.onrender.com';
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\nDisallow: /dashboard\nDisallow: /dashboard/\nDisallow: /checkout\nDisallow: /checkout/\nDisallow: /cart\nDisallow: /cart/\nDisallow: /auth\nDisallow: /auth/\nDisallow: /api/\n\nSitemap: https://cosmicnidhi.com/sitemap.xml\nSitemap: ${baseUrl}/sitemap.xml\n`);
});
app.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send('# Cosmic Nidhi Ads.txt\n');
});
app.get('/llms.txt', (req, res) => {
  res.type('text/plain');
  res.set('Cache-Control', 'public, max-age=86400');
  const baseUrl = process.env.FRONTEND_URL || 'https://cosmicnidhi-front.onrender.com';
  res.send(`# Cosmic Nidhi - Vedic Astrology & Vastu Consultation\n> Authentic Vedic astrology, personalized birth chart readings, applied Vastu consultations, and certified spiritual gemstones.\n\n## Overview\nCosmic Nidhi is a premier platform dedicated to authentic Vedic wisdom, personalized astrological analysis, and spatial energy alignment.\n\n## Key URLs\n- Homepage: ${baseUrl}/\n- Services: ${baseUrl}/services\n- Products: ${baseUrl}/products\n- Pitra Dosh Calculator: ${baseUrl}/pitra-dosh-calculator\n- Zodiac Index: ${baseUrl}/zodiac\n- About: ${baseUrl}/about\n- Contact: ${baseUrl}/contact\n`);
});

// Health check (available at both /api/health and /health)
const { getRazorpayClient } = require('./controllers/paymentController');
const healthHandler = (req, res) => {
  try {
    const { keyId, secret } = getRazorpayClient();
    res.json({
      status: 'OK',
      message: 'Cosmic Nidhi API is running',
      version: '2.1.1',
      deployedAt: '2026-10-01',
      razorpay: {
        keyIdPrefix: keyId ? keyId.slice(0, 8) + '...' : 'none',
        isLiveKey: keyId ? keyId.startsWith('rzp_live_') : false,
        hasSecret: !!secret,
        secretLength: secret ? secret.length : 0,
      },
    });
  } catch (err) {
    res.json({ status: 'OK', message: 'Cosmic Nidhi API is running', version: '2.1.1' });
  }
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Error handling
app.use(errorHandler);

module.exports = app;