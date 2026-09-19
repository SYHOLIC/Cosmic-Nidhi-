const express = require('express');
const router = express.Router();
const { getPages, getPageBySlug, createOrUpdatePage, deletePage } = require('../controllers/pageController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getPages)
  .post(protect, admin, createOrUpdatePage);

router.route('/:slug')
  .get(getPageBySlug)
  .delete(protect, admin, deletePage);

module.exports = router;
