// controllers/productController.js
const { Product, Category } = require('../models');

// Retorna todos os produtos
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: Category
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

// Retorna produtos filtrados por categoria
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    const products = await Product.findAll({
      where: { categoryId },
      include: Category
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos por categoria' });
  }
};

module.exports = { getProducts, getProductsByCategory };
