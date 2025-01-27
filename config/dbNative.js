const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDBNative = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log('MongoDB Native: Database Connected');
    db = client.db('Cluster0');
  } catch (error) {
    console.error('MongoDB Native Connection Error:', error.message);
    process.exit(1);
  }
};

const getDb = () => db;

module.exports = { connectDBNative, getDb };
