const Message = require('../models/Message');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newMessage = await Message.create({
      name,
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
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
