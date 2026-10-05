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
// @route   GET /api/categories (Public) and GET /api/admin/categories (Admin)
// @access  Public / Private (Admin)
const getCategories = async (req, res) => {
  try {
    const isAdmin = Boolean(req.user && req.user.role === 'admin');
    const query = isAdmin ? {} : { isActive: true };
    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort({ createdAt: 1 });

    const countMatch = isAdmin
      ? { category: { $ne: null } }
      : { category: { $ne: null }, isActive: true };

    const directCounts = await Product.aggregate([
      { $match: countMatch },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const directCountMap = {};
    directCounts.forEach((item) => {
      if (item._id) {
        directCountMap[item._id.toString()] = item.count;
      }
    });

    // Build parent-to-children mapping to resolve subcategories recursively
    const childrenMap = {};
    categories.forEach((cat) => {
      const parentId = cat.parentCategory?._id
        ? cat.parentCategory._id.toString()
        : cat.parentCategory
        ? cat.parentCategory.toString()
        : null;
      if (parentId) {
        if (!childrenMap[parentId]) childrenMap[parentId] = [];
        childrenMap[parentId].push(cat._id.toString());
      }
    });

    // Helper to recursively collect all descendant category IDs
    const getDescendantIds = (catId) => {
      const directChildren = childrenMap[catId] || [];
      let all = [...directChildren];
      for (const childId of directChildren) {
        all = all.concat(getDescendantIds(childId));
      }
      return all;
    };

    const categoriesWithCount = categories.map((category) => {
      const catIdStr = category._id.toString();
      const descendantIds = getDescendantIds(catIdStr);
      const directProductCount = directCountMap[catIdStr] || 0;
      const subcategoryProductCount = descendantIds.reduce(
        (sum, id) => sum + (directCountMap[id] || 0),
        0
      );
      const totalProductCount = directProductCount + subcategoryProductCount;

      return {
        ...category.toObject(),
        directProductCount,
        subcategoryProductCount,
        productCount: totalProductCount,
        totalProductCount,
      };
    });

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

    // Find all subcategories recursively
    const allCategories = await Category.find({ isActive: true });
    const childrenMap = {};
    allCategories.forEach((cat) => {
      const parentId = cat.parentCategory?.toString();
      if (parentId) {
        if (!childrenMap[parentId]) childrenMap[parentId] = [];
        childrenMap[parentId].push(cat._id.toString());
      }
    });

    const getDescendants = (catId) => {
      const children = childrenMap[catId] || [];
      let all = [...children];
      for (const c of children) {
        all = all.concat(getDescendants(c));
      }
      return all;
    };

    const targetCategoryIds = [
      category._id.toString(),
      ...getDescendants(category._id.toString()),
    ];

    const products = await Product.find({
      category: { $in: targetCategoryIds },
      isActive: true,
    }).limit(20);

    const totalProductCount = await Product.countDocuments({
      category: { $in: targetCategoryIds },
      isActive: true,
    });

    res.status(200).json({
      success: true,
      category,
      products,
      productCount: totalProductCount,
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
    const { name, description, icon, image, parentCategory, isActive, zodiacSigns } =
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
      zodiacSigns: Array.isArray(zodiacSigns) ? zodiacSigns : [],
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