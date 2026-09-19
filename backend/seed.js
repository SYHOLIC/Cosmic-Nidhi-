const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./src/models/User');
  const bcrypt = require('bcryptjs');
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  
  await User.updateOne(
    { email: 'admin@cosmicnidhi.com' },
    { $set: { role: 'admin', password: hashedPassword, name: 'Admin' } },
    { upsert: true }
  );
  await User.updateOne(
    { email: 'admin@cosmicnidhi.in' },
    { $set: { role: 'admin', password: hashedPassword, name: 'Admin' } },
    { upsert: true }
  );
  
  console.log('✅ Seeded admin users (.com & .in) on Atlas');
  process.exit(0);
}).catch(console.error);
