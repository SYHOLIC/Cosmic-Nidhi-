const { MongoClient } = require('mongodb');
require('dotenv').config();

const SOURCE_URI = process.env.MONGODB_URI;
const TARGET_URI = process.argv[2];

if (!TARGET_URI) {
  console.error('\n❌ ERROR: Please provide the target database connection string as an argument.');
  process.exit(1);
}

async function cloneDatabase() {
  console.log('\n🔄 Starting MongoDB Database Clone...');
  console.log('📡 Connecting to Source & Target Databases...');

  const sourceClient = new MongoClient(SOURCE_URI);
  const targetClient = new MongoClient(TARGET_URI);

  try {
    await sourceClient.connect();
    await targetClient.connect();

    const sourceDb = sourceClient.db();
    const targetDb = targetClient.db('cosmic-nidhi');

    console.log(`✅ Source DB Connected: "${sourceDb.databaseName}"`);
    console.log(`✅ Target DB Connected: "${targetDb.databaseName}"\n`);

    const collections = await sourceDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections to clone.\n`);

    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName.startsWith('system.')) continue;

      const sourceCol = sourceDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      const count = await sourceCol.countDocuments();

      if (count === 0) {
        console.log(`⚪ [${colName}] is empty (0 docs), created empty collection.`);
        await targetDb.createCollection(colName).catch(() => {});
        continue;
      }

      console.log(`⏳ [${colName}] Fetching ${count} documents...`);
      const docs = await sourceCol.find({}).toArray();

      // Clean target collection before inserting to prevent duplicate keys
      await targetCol.deleteMany({});
      await targetCol.insertMany(docs);
      console.log(`   ✅ [${colName}] Successfully cloned ${docs.length} documents.`);

      // Clone indexes
      try {
        const indexes = await sourceCol.indexes();
        for (const index of indexes) {
          if (index.name === '_id_') continue;
          const { key, ...options } = index;
          delete options.ns;
          delete options.v;
          await targetCol.createIndex(key, options).catch(() => {});
        }
      } catch (idxErr) {
        // Skip index issues if any
      }
    }

    console.log('\n🎉 CLONING COMPLETE! All collections and documents were successfully migrated.');
  } catch (err) {
    console.error('\n❌ Cloning failed:', err);
  } finally {
    await sourceClient.close();
    await targetClient.close();
    process.exit(0);
  }
}

cloneDatabase();
