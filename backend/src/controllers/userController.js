const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
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

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.body.phone !== undefined) {
      const cleanPhone = String(req.body.phone).trim();
      if (cleanPhone && !/^\d{10}$/.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be exactly 10 digits',
        });
      }
      user.phone = cleanPhone;
    }

    if (req.body.name !== undefined) {
      const cleanName = String(req.body.name).trim();
      if (!cleanName || !/^[a-zA-Z\s]{2,50}$/.test(cleanName)) {
        return res.status(400).json({
          success: false,
          message: 'Name must contain only alphabets and spaces (2 to 50 characters)',
        });
      }
      user.name = cleanName;
    }
    
    if (req.body.dateOfBirth) {
      user.dateOfBirth = req.body.dateOfBirth;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        dateOfBirth: updatedUser.dateOfBirth,
        addresses: updatedUser.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const cleanName = String(req.body.name || '').trim();
    if (!cleanName || !/^[a-zA-Z\s]{2,50}$/.test(cleanName)) {
      return res.status(400).json({
        success: false,
        message: 'Name must contain only alphabets and spaces (2 to 50 characters)',
      });
    }

    if (req.body.phone && !/^\d{10}$/.test(String(req.body.phone).trim())) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits',
      });
    }
    if (req.body.pincode && !/^\d{6}$/.test(String(req.body.pincode).trim())) {
      return res.status(400).json({
        success: false,
        message: 'Pincode must be exactly 6 digits',
      });
    }

    const newAddress = {
      name: cleanName,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country || 'India',
      isDefault: req.body.isDefault || false,
    };

    // If this is set to default, unset others
    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    } else if (user.addresses.length === 0) {
      // First address is always default
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update an address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    if (req.body.phone && !/^\d{10}$/.test(String(req.body.phone).trim())) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits',
      });
    }
    if (req.body.pincode && !/^\d{6}$/.test(String(req.body.pincode).trim())) {
      return res.status(400).json({
        success: false,
        message: 'Pincode must be exactly 6 digits',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    if (req.body.name !== undefined) {
      const cleanName = String(req.body.name).trim();
      if (!cleanName || !/^[a-zA-Z\s]{2,50}$/.test(cleanName)) {
        return res.status(400).json({
          success: false,
          message: 'Name must contain only alphabets and spaces (2 to 50 characters)',
        });
      }
      address.name = cleanName;
    }
    address.phone = req.body.phone || address.phone;
    address.address = req.body.address || address.address;
    address.city = req.body.city || address.city;
    address.state = req.body.state || address.state;
    address.pincode = req.body.pincode || address.pincode;
    address.country = req.body.country || address.country;
    
    if (req.body.isDefault !== undefined) {
      if (req.body.isDefault) {
        user.addresses.forEach((addr) => {
          addr.isDefault = false;
        });
      }
      address.isDefault = req.body.isDefault;
    }

    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Use pull to remove the subdocument
    user.addresses.pull(req.params.id);

    // If we deleted the default, set the first remaining one to default
    if (address.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user cart
// @route   PUT /api/users/cart
// @access  Private
const updateCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.cart = Array.isArray(req.body.cart) ? req.body.cart : [];
    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { productId } = req.params;
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const populatedUser = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      wishlist: populatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      wishlist: populatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  getAddresses,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getCart,
  updateCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
