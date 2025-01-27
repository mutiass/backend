const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDBMongoose = require('./config/dbMongoose');
const { connectDBNative } = require('./config/dbNative');
const productRoutesMongoose = require('./routes/productRoutesMongoose');
const productRoutesNative = require('./routes/productRoutesNative');

dotenv.config();

const app = express();
connectDBMongoose();
connectDBNative();

app.use(cors());
app.use(express.json());

// Rute untuk API
app.use('/api/v1/products', productRoutesNative); // Koneksi MongoDB Native
app.use('/api/v2/products', productRoutesMongoose); // Koneksi Mongoose

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
