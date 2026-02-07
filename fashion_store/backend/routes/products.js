const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// @route   GET /api/products
// @desc    Get all products from the database
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  
});
router.get('/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        category: req.params.categoryName
      }
    });
    if (products.length === 0) {
      return res.status(404).json({ msg: 'No products found in this category' });
    }
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;