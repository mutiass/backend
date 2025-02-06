const { ObjectId } = require('mongodb');
const { getDb } = require('../config/dbNative');

// createProduct
const createProduct = async (req, res) => {
  const { name, price, stock, status } = req.body;

  try {
    const db = getDb();
    const newProduct = {
      name,
      price: Number(price),
      stock: Number(stock),
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
const axios = require('axios');

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }

  try {
    const db = getDb();

    // Update produk di v1
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, price, stock, status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found in v1' });
    }

    // Ambil data yang baru diperbarui dari v1
    const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(id) });

    // Kirim permintaan update ke v2 (Mongoose)
    const v2Response = await axios.put(`http://localhost:5000/api/v2/products/${id}`, {
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      status: updatedProduct.status,
    });

    res.json({
      message: 'Product updated successfully in v1 and v2',
      updatedProduct,
      v2Response: v2Response.data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// deleteProduct
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }

  try {
    const db = getDb();

    // Ambil data produk dari v1 sebelum dihapus
    const productV1 = await db.collection('products').findOne({ _id: new ObjectId(id) });

    if (!productV1) {
      return res.status(404).json({ message: 'Product not found in v1' });
    }

    // Hapus produk di v1
    const resultV1 = await db.collection('products').deleteOne({ _id: new ObjectId(id) });

    if (resultV1.deletedCount === 0) {
      return res.status(404).json({ message: 'Failed to delete product in v1' });
    }

    // Hapus produk di v2 berdasarkan `name` dan `price`
    const resultV2 = await axios.delete('http://localhost:5000/api/v2/products/delete-by-name-price', {
      data: { name: productV1.name, price: productV1.price }
    });

    res.json({ message: 'Product deleted successfully in both v1 and v2' });
  } catch (error) {
    console.error(error);
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
