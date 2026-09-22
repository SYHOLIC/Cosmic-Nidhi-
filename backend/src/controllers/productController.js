const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');


// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Build filter
    const filter = { isActive: true };
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex }
      ];
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      images,
      stock,
      features,
      isActive,
      isFeatured,
      badge,
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Sync image and images array
    let productImages = images || [];
    if (req.body.image && (!productImages || productImages.length === 0)) {
      productImages = [req.body.image];
    }

    const generatedSku = req.body.sku || req.body.SKU || `CN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const product = await Product.create({
      name,
      description,
      shortDescription,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      images: productImages,
      stock: stock !== undefined ? Number(stock) : 0,
      features: features || [],
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      badge: badge || '',
      sku: generatedSku,
      SKU: generatedSku,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Regenerate slug if name changed or slug is missing
    if ((req.body.name && req.body.name !== product.name) || !product.slug) {
      const base = (req.body.name || product.name || 'product')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      req.body.slug = `${base}-${Date.now()}`;
    }

    // Normalize category if an object was passed
    if (req.body.category && typeof req.body.category === 'object') {
      req.body.category = req.body.category._id || req.body.category.id;
    }

    // Sync image and images array
    if (req.body.image && (!req.body.images || req.body.images.length === 0)) {
      req.body.images = [req.body.image];
    } else if (Array.isArray(req.body.images) && req.body.images.length > 0 && !req.body.image) {
      req.body.image = req.body.images[0];
    }

    // Ensure price and stock are parsed as numbers
    if (req.body.price !== undefined) {
      req.body.price = Number(req.body.price);
    }
    if (req.body.originalPrice !== undefined && req.body.originalPrice !== null && req.body.originalPrice !== '') {
      req.body.originalPrice = Number(req.body.originalPrice);
    }
    if (req.body.stock !== undefined) {
      req.body.stock = Number(req.body.stock);
    }

    if (!product.sku && !req.body.sku) {
      const genSku = `CN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      req.body.sku = genSku;
      req.body.SKU = genSku;
    } else if (req.body.sku && !req.body.SKU) {
      req.body.SKU = req.body.sku;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};



const getProductBySlug = async (req, res) => {
  try {
    let product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product && mongoose.Types.ObjectId.isValid(req.params.slug)) {
      product = await Product.findById(req.params.slug).populate('category', 'name slug');
    }
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const Review = require('../models/Review');
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(limit)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search?q=keyword
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
      ],
      isActive: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductReviews,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
};