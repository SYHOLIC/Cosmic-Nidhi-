const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Drop legacy non-sparse indexes if present in collections
    try {
      await mongoose.connection.collection('products').dropIndex('SKU_1').catch(() => {});
      await mongoose.connection.collection('products').dropIndex('sku_1').catch(() => {});
      await mongoose.connection.collection('reviews').dropIndex('userId_1_productId_1').catch(() => {});
    } catch (_) {}
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;