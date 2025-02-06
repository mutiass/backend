// Untuk mongoose
const mongoose = require('mongoose'); 

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  status: {type: Boolean, required: true}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

