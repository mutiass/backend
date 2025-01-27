const { ObjectId } = require('mongoose').Types; // Impor ObjectId dari Mongoose
const Product = require('../models/product');

// createProduct
const createProduct = async (req, res) => {
  const { name, price, stock, status } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      stock,
      status,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// getProducts
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// getProductById
const getProductById = async (req, res) => {
  const { id } = req.params;

  // Pastikan ID valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// updateProduct
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;

  // Pastikan ID valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, stock, status },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// deleteProduct
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Pastikan ID valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
