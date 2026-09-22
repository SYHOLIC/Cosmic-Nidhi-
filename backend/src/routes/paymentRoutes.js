const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  verifyUpiPayment,
  getPaymentConfig,
} = require('../controllers/paymentController');
const { optionalProtect } = require('../middleware/auth');

router.get('/config', getPaymentConfig);
router.post('/create-order', optionalProtect, createRazorpayOrder);
router.post('/verify', optionalProtect, verifyPayment);
router.post('/verify-upi', optionalProtect, verifyUpiPayment);

module.exports = router;
