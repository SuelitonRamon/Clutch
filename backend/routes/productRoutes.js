const express = require('express');
const router = express.Router();
const upload = require('../config/multer');  // Importando a configuração do Multer
const productController = require('../controllers/productController');

// Rota para criar um novo produto com upload de imagens
router.post('/products', 
  upload.fields([
    { name: 'capa', maxCount: 1 },    // Imagem da capa
    { name: 'img_1', maxCount: 1 },   // Imagem 1
    { name: 'img_2', maxCount: 1 },   // Imagem 2
    { name: 'img_3', maxCount: 1 },   // Imagem 3
  ]), 
  productController.createProduct   // Chama o controlador para criar o produto
);

// Rota para listar todos os produtos
router.get('/products', productController.getAllProducts);

// Rota para obter um produto específico pelo ID
router.get('/products/:id', productController.getProductById);

// Rota para atualizar um produto existente
router.put('/products/:id', productController.updateProduct);

// Rota para excluir um produto
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
