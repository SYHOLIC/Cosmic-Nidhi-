const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');

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

    // Validate items, resolve product IDs, and check stock
    for (const item of sanitizedItems) {
      let product = null;

      // Check if item.product is already a valid 24-char ObjectId
      if (
        item.product &&
        mongoose.Types.ObjectId.isValid(item.product) &&
        String(new mongoose.Types.ObjectId(item.product)) === String(item.product)
      ) {
        product = await Product.findById(item.product);
      }

      // If not found by ObjectId, try searching by slug or name
      if (!product) {
        const queryTerm = String(item.product || item.name || '').trim();
        if (queryTerm) {
          product = await Product.findOne({
            $or: [
              { slug: queryTerm.toLowerCase() },
              { name: new RegExp(`^${queryTerm}$`, 'i') },
              { slug: (item.name || '').toLowerCase() }
            ]
          });
        }
      }

      // If still not found in MongoDB (e.g. curated zodiac stone from static list), auto-create a product record
      if (!product) {
        let defaultCat = await Category.findOne({ name: /crystal|gemstone|zodiac/i });
        if (!defaultCat) {
          defaultCat = await Category.findOne({});
        }
        if (!defaultCat) {
          defaultCat = await Category.create({
            name: 'Crystals & Gemstones',
            slug: 'crystals-gemstones',
            description: 'Natural healing crystals and stones',
          });
        }

        const itemName = item.name || item.product || 'Astrology Product';
        const cleanBase = itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const autoSku = `CN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        try {
          product = await Product.create({
            name: itemName,
            slug: `${cleanBase}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
            description: `Authentic ${itemName} curated for astrological harmony and spiritual balance.`,
            price: item.price || 449,
            originalPrice: Math.round((item.price || 449) * 1.3),
            category: defaultCat._id,
            images: item.image ? [item.image] : [],
            stock: 999,
            isActive: true,
            badge: 'Popular',
            sku: autoSku,
            SKU: autoSku,
          });
        } catch (_) {
          // If creation collided, pick any existing product or fallback
          product = await Product.findOne({});
        }
      }

      // Guarantee item.product is a valid MongoDB ObjectId
      if (product) {
        item.product = product._id;
        item.name = item.name || product.name;
        item.price = item.price || product.price;
        item.image = item.image || (product.images && product.images[0]) || '';
      } else {
        return res.status(400).json({
          success: false,
          message: `Unable to process product item: ${item.name || item.product}`,
        });
      }

      if (product.stock !== undefined && product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Generate sequential order number
    let generatedOrderNumber = req.body.orderNumber;
    if (!generatedOrderNumber || !/^CN-\d+$/.test(generatedOrderNumber)) {
      const lastOrder = await Order.findOne({ orderNumber: /^CN-\d+$/ }).sort({ createdAt: -1 });
      let nextSeq = 1001;
      if (lastOrder && lastOrder.orderNumber) {
        const match = lastOrder.orderNumber.match(/^CN-(\d+)$/);
        if (match) {
          nextSeq = parseInt(match[1], 10) + 1;
        }
      } else {
        const count = await Order.countDocuments();
        nextSeq = 1000 + count + 1;
      }
      generatedOrderNumber = `CN-${nextSeq}`;
    }

    if (shippingAddress) {
      if (shippingAddress.name && !/^[a-zA-Z\s]{2,50}$/.test(String(shippingAddress.name).trim())) {
        return res.status(400).json({
          success: false,
          message: 'Shipping Full Name must contain only alphabets and spaces',
        });
      }
      if (shippingAddress.phone && !/^\d{10}$/.test(String(shippingAddress.phone).trim())) {
        return res.status(400).json({
          success: false,
          message: 'Shipping phone number must be exactly 10 digits',
        });
      }
      if (shippingAddress.pincode && !/^\d{6}$/.test(String(shippingAddress.pincode).trim())) {
        return res.status(400).json({
          success: false,
          message: 'Shipping pincode must be exactly 6 digits',
        });
      }
    }

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
    for (const item of sanitizedItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        }).catch(() => {});
      }
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
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }
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