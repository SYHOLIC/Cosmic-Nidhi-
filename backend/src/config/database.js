const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Drop legacy non-sparse unique indexes if present in collections
    try {
      const productIndexes = await mongoose.connection.collection('products').indexes().catch(() => []);
      for (const idx of productIndexes) {
        if ((idx.name.toLowerCase().includes('sku') || idx.key?.sku !== undefined || idx.key?.SKU !== undefined) && idx.name !== '_id_') {
          await mongoose.connection.collection('products').dropIndex(idx.name).catch(() => {});
        }
      }
      await mongoose.connection.collection('reviews').dropIndex('userId_1_productId_1').catch(() => {});
    } catch (_) {}
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;