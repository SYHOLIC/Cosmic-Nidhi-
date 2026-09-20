const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay client helper
const getRazorpayClient = () => {
  let secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || secret.includes('placeholder')) {
    secret = 'FVHZojFoQPSImZrvJRIGx3bZ';
  }
  if (secret.startsWith('b64:')) {
    try {
      secret = Buffer.from(secret.slice(4), 'base64').toString('utf8');
    } catch (e) {
      console.error('Failed to decode b64 RAZORPAY_KEY_SECRET:', e);
    }
  }

  let keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId || keyId.includes('placeholder')) {
    keyId = 'rzp_test_TeAqFB25uZz5vD';
  }
  keyId = keyId.trim();

  return {
    client: new Razorpay({ key_id: keyId, key_secret: secret.trim() }),
    keyId,
    secret: secret.trim(),
  };
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const { client, keyId } = getRazorpayClient();

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await client.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      keyId,
    });
  } catch (error) {
    console.error('Create Razorpay Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      local_order_id,
    } = req.body;

    const { secret } = getRazorpayClient();

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', secret)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is authentic
      
      // If we passed the local mongodb order ID, update its status
      if (local_order_id) {
        const order = await Order.findById(local_order_id);
        if (order) {
          order.paymentStatus = 'paid';
          order.paymentId = razorpay_payment_id;
          order.orderStatus = 'processing';
          await order.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature sent!',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
