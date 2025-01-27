const { ObjectId } = require('mongodb'); // Impor ObjectId dari MongoDB Native
const { getDb } = require('../config/dbNative'); // Pastikan koneksi database diatur dengan benar

// createProduct
const createProduct = async (req, res) => {
  const { name, price, stock, status } = req.body;

  try {
    const db = getDb();
    const newProduct = {
      name,
      price,
      stock,
      status,
    };

    const result = await db.collection('products').insertOne(newProduct);
    res.status(201).json({
      id: result?.insertedId,
      status: 'Produk berhasil ditambahkan',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// getProducts
const getProducts = async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection('products').find().toArray();
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
    const db = getDb();
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
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
    const db = getDb();
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, price, stock, status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
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
    const db = getDb();
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
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
