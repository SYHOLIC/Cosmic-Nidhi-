// Run this in your backend to create an admin user
// server/createAdmin.js

const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const admin = await User.findOne({ email: 'admin@cosmicnidhi.in' });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'admin@cosmicnidhi.in',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();