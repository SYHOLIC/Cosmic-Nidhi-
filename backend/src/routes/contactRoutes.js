const express = require('express');
const router = express.Router();
const { submitContact, getMessages } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(submitContact)
  .get(protect, admin, getMessages);

module.exports = router;
