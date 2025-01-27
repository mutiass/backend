const mongoose = require('mongoose');
require('dotenv').config();

const connectDBMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongoose: MongoDB Connected');
  } catch (error) {
    console.error('Mongoose Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDBMongoose;
