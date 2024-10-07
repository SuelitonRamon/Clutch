// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, getProductsByCategory } = require('../controllers/productController');

// Rota para obter todos os produtos
router.get('/products', getProducts);

// Rota para obter produtos filtrados por categoria
router.get('/products/category/:categoryId', getProductsByCategory);

module.exports = router;
