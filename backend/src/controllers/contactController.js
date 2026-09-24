const Message = require('../models/Message');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const cleanName = String(name).trim();
    if (!/^[a-zA-Z\s]{2,50}$/.test(cleanName)) {
      return res.status(400).json({
        success: false,
        message: "Name must contain only alphabets and spaces (2 to 50 characters)",
      });
    }

    const newMessage = await Message.create({
      name: cleanName,
      email,
      subject,
      message
    });

    res.status(201).json({ success: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    const unreadCount = await Message.countDocuments({ isRead: false });
    res.json({ success: true, messages, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleMessageRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (typeof req.body.isRead === 'boolean') {
      message.isRead = req.body.isRead;
    } else {
      message.isRead = !message.isRead;
    }

    await message.save();
    res.json({
      success: true,
      message: 'Message status updated',
      isRead: message.isRead,
      data: message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await message.deleteOne();
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
