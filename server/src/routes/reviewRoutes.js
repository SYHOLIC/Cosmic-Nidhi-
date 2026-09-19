const express = require('express');
const router = express.Router();
const { getReviews, deleteReview, createReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getReviews)
  .post(protect, createReview);

router.route('/:id')
  .delete(protect, admin, deleteReview);

module.exports = router;
