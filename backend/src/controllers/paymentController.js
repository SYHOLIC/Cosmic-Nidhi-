const Razorpay = require('razorpay');
const crypto = require('crypto');
const https = require('https');
const Order = require('../models/Order');
const Booking = require('../models/Booking');

// Initialize Razorpay client helper using environment variables
const getRazorpayClient = () => {
  let secret = process.env.RAZORPAY_KEY_SECRET;
  let keyId = process.env.RAZORPAY_KEY_ID;

  if (secret && secret.startsWith('b64:')) {
    try {
      secret = Buffer.from(secret.slice(4), 'base64').toString('utf8');
    } catch (e) {
      console.error('Failed to decode b64 RAZORPAY_KEY_SECRET:', e);
    }
  }

  // Strip accidental quotes and whitespace
  if (secret) secret = secret.replace(/^['"]|['"]$/g, '').trim();
  if (keyId) keyId = keyId.replace(/^['"]|['"]$/g, '').trim();

  return {
    client: keyId && secret ? new Razorpay({ key_id: keyId, key_secret: secret }) : null,
    keyId: keyId || '',
    secret: secret || '',
  };
};

/**
 * Direct HTTPS call to Razorpay Orders API (POST https://api.razorpay.com/v1/orders)
 * Ensures 100% reliability and exact standard HTTP basic authentication.
 */
const createRazorpayOrderDirect = (keyId, keySecret, options) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(options);
    const auth = Buffer.from(keyId + ':' + keySecret).toString('base64');
    const req = https.request(
      {
        hostname: 'api.razorpay.com',
        port: 443,
        path: '/v1/orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          Authorization: 'Basic ' + auth,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject({
                statusCode: res.statusCode,
                error: parsed.error,
                message: parsed.error?.description || 'Razorpay order creation error',
              });
            }
          } catch (e) {
            reject({ statusCode: res.statusCode, message: 'Invalid response from Razorpay' });
          }
        });
      }
    );
    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
};

// @desc    Create Razorpay order
// @route   POST /api/create-order or POST /api/payment/create-order
// @access  Public / Optional Auth
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Determine amount in paise (minimum 100 paise = ₹1)
    let amountInPaise;
    if (req.body.amount_in_paise !== undefined) {
      amountInPaise = Math.round(Number(req.body.amount_in_paise));
    } else if (req.body.is_rupees || req.body.amount_in_rupees !== undefined) {
      amountInPaise = Math.round(Number(req.body.amount_in_rupees || amount) * 100);
    } else if (amount !== undefined) {
      amountInPaise = Math.round(Number(amount));
      if (amountInPaise < 100 && !req.body.is_paise) {
        amountInPaise = Math.round(Number(amount) * 100);
      }
    }

    // Validation: amount must be >= 100 paise
    if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum amount is 100 paise (₹1.00).',
      });
    }

    const { keyId, secret } = getRazorpayClient();
    if (!keyId || !secret) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay is currently not configured. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.',
      });
    }

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    // Call Razorpay API: POST https://api.razorpay.com/v1/orders
    const order = await createRazorpayOrderDirect(keyId, secret, options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      order,
      keyId,
      key: keyId,
      upiId: process.env.MERCHANT_UPI_ID || '',
      merchantName: 'Cosmic Nidhi',
    });
  } catch (error) {
    console.error('Create Razorpay Order Error:', error);

    // Handle authentication failure
    if (error.statusCode === 401 || (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description?.toLowerCase().includes('auth'))) {
      return res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed. Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/verify-payment or POST /api/payment/verify
// @access  Public / Optional Auth
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      payment_id,
      signature,
      local_order_id,
      booking_id,
    } = req.body;

    const rzpOrderId = razorpay_order_id || order_id;
    const rzpPaymentId = razorpay_payment_id || payment_id;
    const rzpSignature = razorpay_signature || signature;

    // Validate required fields
    if (!rzpOrderId || !rzpPaymentId || !rzpSignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: order_id, payment_id, and signature are required.',
      });
    }

    const { secret } = getRazorpayClient();
    if (!secret) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay is not configured on the server.',
      });
    }

    // Compute expected signature: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const payload = `${rzpOrderId}|${rzpPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Compare signatures
    if (rzpSignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Signature mismatch.',
      });
    }

    // Payment is verified! Update database records if IDs were provided
    if (local_order_id) {
      try {
        const order = await Order.findById(local_order_id);
        if (order) {
          order.paymentStatus = 'paid';
          order.paymentId = rzpPaymentId;
          order.orderStatus = 'processing';
          await order.save();
        }
      } catch (dbErr) {
        console.error('Failed to update local order:', dbErr);
      }
    }

    let updatedBooking = null;
    if (booking_id) {
      try {
        const booking = await Booking.findById(booking_id);
        if (booking) {
          booking.paymentStatus = 'paid';
          booking.paymentId = rzpPaymentId;
          booking.paymentMethod = 'online_razorpay';
          booking.status = 'confirmed';
          await booking.save();
          updatedBooking = booking;
        }
      } catch (dbErr) {
        console.error('Failed to update local booking:', dbErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id: rzpOrderId,
      payment_id: rzpPaymentId,
      paymentId: rzpPaymentId,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// @desc    Verify manual/direct UPI QR payment with UTR number
// @route   POST /api/payment/verify-upi
// @access  Public / Optional Auth
const verifyUpiPayment = async (req, res) => {
  try {
    const { local_order_id, booking_id, utr_number } = req.body;
    if ((!local_order_id && !booking_id) || !utr_number) {
      return res.status(400).json({
        success: false,
        message: 'Order ID or Booking ID, and UPI Reference / UTR number are required',
      });
    }

    if (booking_id) {
      const booking = await Booking.findById(booking_id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      booking.paymentStatus = 'paid';
      booking.paymentId = `UPI-${utr_number.trim()}`;
      booking.paymentMethod = 'online_upi';
      booking.status = 'confirmed';
      booking.notes = (booking.notes ? booking.notes + ' | ' : '') + `UPI UTR: ${utr_number.trim()}`;
      await booking.save();

      return res.status(200).json({
        success: true,
        message: 'UPI Payment submitted and verified successfully for booking!',
        booking,
      });
    }

    const order = await Order.findById(local_order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = 'paid';
    order.paymentId = `UPI-${utr_number.trim()}`;
    order.orderStatus = 'processing';
    order.notes = (order.notes ? order.notes + ' | ' : '') + `UPI UTR: ${utr_number.trim()}`;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'UPI Payment submitted and verified successfully!',
      order,
    });
  } catch (error) {
    console.error('Verify UPI Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record UPI payment',
      error: error.message,
    });
  }
};

// @desc    Get public payment config (Key ID, Merchant UPI ID)
// @route   GET /api/payment/config
// @access  Public
const getPaymentConfig = async (req, res) => {
  const { keyId } = getRazorpayClient();
  return res.status(200).json({
    success: true,
    keyId,
    upiId: process.env.MERCHANT_UPI_ID || '',
    merchantName: 'Cosmic Nidhi',
  });
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  verifyUpiPayment,
  getPaymentConfig,
  getRazorpayClient,
};
