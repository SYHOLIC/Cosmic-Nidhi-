const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      couponCode,
      discount,
      notes,
    } = req.body;

    const cleanNumber = (val) => {
      if (typeof val === 'number') return val;
      return parseFloat(String(val || 0).replace(/[^\d.]/g, '')) || 0;
    };

    const sanitizedItems = (items || []).map(item => ({
      ...item,
      price: cleanNumber(item.price),
      quantity: parseInt(item.quantity, 10) || 1,
    }));

    // Validate items and check stock
    for (const item of sanitizedItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Create order
    const generatedOrderNumber = req.body.orderNumber || ('CN-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900));
    const order = await Order.create({
      orderNumber: generatedOrderNumber,
      user: req.user.id,
      items: sanitizedItems,
      shippingAddress,
      paymentMethod,
      subtotal: cleanNumber(subtotal),
      tax: cleanNumber(tax),
      shippingCost: cleanNumber(shippingCost),
      totalAmount: cleanNumber(totalAmount),
      couponCode,
      discount: cleanNumber(discount),
      notes,
    });

    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Populate order
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name price images')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name price images')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is authorized
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is authorized
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a delivered order',
      });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price images')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrders,
};