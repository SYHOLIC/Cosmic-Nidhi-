const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
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
} = require('../controllers/userController');

// All these routes require user to be logged in
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

router.route('/cart').get(getCart).put(updateCart);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;