const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true,
    default: () => `CN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: String,
  }],
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'upi_qr', 'online_upi', 'upi', 'card', 'online_razorpay', 'pay_later'],
    default: 'razorpay',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: String,
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  couponCode: String,
  discount: {
    type: Number,
    default: 0,
  },
  notes: String,
}, {
  timestamps: true,
});

orderSchema.pre('validate', async function () {
  if (!this.orderNumber || !/^CN-\d+$/.test(this.orderNumber)) {
    try {
      const OrderModel = this.constructor;
      const lastOrder = await OrderModel.findOne({ orderNumber: /^CN-\d+$/ }).sort({ createdAt: -1 });
      let nextSeq = 1001;
      if (lastOrder && lastOrder.orderNumber) {
        const match = lastOrder.orderNumber.match(/^CN-(\d+)$/);
        if (match) {
          nextSeq = parseInt(match[1], 10) + 1;
        }
      } else {
        const count = await OrderModel.countDocuments();
        nextSeq = 1000 + count + 1;
      }
      this.orderNumber = `CN-${nextSeq}`;
    } catch (err) {
      this.orderNumber = `CN-${Date.now().toString().slice(-6)}`;
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);