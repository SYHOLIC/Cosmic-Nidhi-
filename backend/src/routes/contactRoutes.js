const express = require('express');
const router = express.Router();
const {
  submitContact,
  getMessages,
  toggleMessageRead,
  deleteMessage,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(submitContact)
  .get(protect, admin, getMessages);

router.route('/:id')
  .delete(protect, admin, deleteMessage);

router.route('/:id/read')
  .put(protect, admin, toggleMessageRead);

module.exports = router;
