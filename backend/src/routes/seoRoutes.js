const express = require('express');
const router = express.Router();
const { getSeo, updateSeo } = require('../controllers/seoController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getSeo)
  .post(protect, admin, updateSeo);

module.exports = router;
