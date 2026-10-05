const express = require('express');
const router = express.Router();
const {
  getPublicVideos,
  getFeaturedVideo,
  getVideosByCategory,
} = require('../controllers/videoController');

// Public endpoints
router.get('/', getPublicVideos);
router.get('/featured', getFeaturedVideo);
router.get('/category/:category', getVideosByCategory);

module.exports = router;
