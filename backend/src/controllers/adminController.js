const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Booking = require('../models/Booking');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalBookings,
        totalRevenue: revenue[0]?.total || 0,
      },
      recentOrders,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price slug')
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

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .sort('-date -createdAt');
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get admin notifications (recent orders, bookings, low-stock alerts)
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getNotifications = async (req, res) => {
  try {
    const notifications = [];

    // 1. Recent / Pending Orders (last 10)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    for (const ord of recentOrders) {
      const customerName = ord.user?.name || ord.shippingAddress?.name || 'Customer';
      notifications.push({
        id: `ord_${ord._id}`,
        type: 'order',
        title: ord.orderStatus === 'pending' ? 'New Pending Order' : `Order #${ord._id.toString().slice(-6).toUpperCase()}`,
        message: `₹${ord.totalAmount?.toLocaleString('en-IN') || 0} by ${customerName} · ${ord.orderStatus.toUpperCase()}`,
        status: ord.orderStatus,
        paymentStatus: ord.paymentStatus,
        createdAt: ord.createdAt,
        linkTab: 'orders',
      });
    }

    // 2. Recent / Pending Bookings (last 10)
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    for (const b of recentBookings) {
      const clientName = b.clientDetails?.name || b.user?.name || 'Client';
      notifications.push({
        id: `bk_${b._id}`,
        type: 'booking',
        title: `${b.serviceName || 'Consultation'} Booking`,
        message: `${clientName} · ${new Date(b.date).toLocaleDateString()} at ${b.time} (${b.status})`,
        status: b.status,
        paymentStatus: b.paymentStatus,
        createdAt: b.createdAt,
        linkTab: 'bookings',
      });
    }

    // 3. Low stock products (stock <= 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isActive: true })
      .select('name stock price')
      .limit(10);

    for (const p of lowStockProducts) {
      notifications.push({
        id: `stock_${p._id}`,
        type: 'alert',
        title: p.stock === 0 ? 'Out of Stock Alert' : 'Low Stock Warning',
        message: `"${p.name}" has ${p.stock === 0 ? '0' : 'only ' + p.stock} unit(s) remaining.`,
        status: p.stock === 0 ? 'out_of_stock' : 'low_stock',
        createdAt: p.updatedAt || new Date(),
        linkTab: 'products',
      });
    }

    // Sort all by createdAt descending
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      notifications: notifications.slice(0, 25),
      unreadCount: notifications.filter(n => n.status === 'pending' || n.status === 'out_of_stock' || n.status === 'low_stock').length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getOrders,
  getBookings,
  getNotifications,
};