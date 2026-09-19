const Category = require('../models/Category');
const Product = require('../models/Product');

// Helper to generate unique slug
const generateUniqueSlug = async (name, excludeId = null) => {
  let baseSlug =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `category-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await Category.findOne(query);
    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).populate(
      'parentCategory',
      'name slug'
    );

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          isActive: true,
        });
        return {
          ...category.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      'parentCategory',
      'name slug'
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const products = await Product.find({
      category: category._id,
      isActive: true,
    }).limit(20);

    res.status(200).json({
      success: true,
      category,
      products,
      productCount: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, icon, image, parentCategory, isActive } =
      req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(name);

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
      icon: icon || '',
      image: image || '', // base64 or URL
      parentCategory: parentCategory || null,
      isActive: isActive !== false,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const updateData = { ...req.body };

    // Regenerate slug if name changed
    if (updateData.name && updateData.name !== category.name) {
      updateData.slug = await generateUniqueSlug(
        updateData.name,
        req.params.id
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check for products
    const productCount = await Product.countDocuments({
      category: category._id,
    });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: ${productCount} products use this category.`,
      });
    }

    // Check for subcategories
    const childCount = await Category.countDocuments({
      parentCategory: category._id,
    });
    if (childCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: ${childCount} subcategories exist. Delete them first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};