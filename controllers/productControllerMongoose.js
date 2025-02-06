const { ObjectId } = require('mongoose').Types;
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
const { name, price, stock, status } = req.body;

  try {
    // Update produk di v2 berdasarkan nama, bukan ID
    const updatedProduct = await Product.findOneAndUpdate(
      { name }, // Cari berdasarkan nama produk
      { name, price, stock, status }, // Update dengan data baru
      { new: true, upsert: true } // Upsert = buat baru jika tidak ada
    );

    res.json({ message: 'Product updated in v2', updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// deleteProduct
const deleteProduct = async (req, res) => {
  const { name, price } = req.body;

  try {
    const result = await Product.findOneAndDelete({ name, price });

    if (!result) {
      return res.status(404).json({ message: 'Product not found in v2' });
    }

    res.json({ message: 'Product deleted successfully in v2' });
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
