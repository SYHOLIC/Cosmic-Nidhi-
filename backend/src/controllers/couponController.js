const Coupon = require('../models/Coupon');

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Coupon is inactive' });
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (totalAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed total amount
    if (discountAmount > totalAmount) {
      discountAmount = totalAmount;
    }

    const newTotal = totalAmount - discountAmount;

    res.json({ success: true, discountAmount, newTotal, code: coupon.code });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
