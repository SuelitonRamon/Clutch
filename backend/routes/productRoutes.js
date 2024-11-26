const express = require('express');
const router = express.Router();
const upload = require('../config/multer');  // Importando a configuração do Multer
const productController = require('../controllers/productController');
const { verificarToken } = require('../controllers/authController');  // Middleware de autenticação
const { verificarRole } = require('../controllers/authController');  // Middleware de autorização

// Rota para criar um novo produto com upload de imagens
router.post('/products', 
  upload.fields([
    { name: 'capa', maxCount: 1 },    // Imagem da capa
    { name: 'img_1', maxCount: 1 },   // Imagem 1
    { name: 'img_2', maxCount: 1 },   // Imagem 2
    { name: 'img_3', maxCount: 1 },   // Imagem 3
  ]), verificarToken, verificarRole('admin'), productController.createProduct);

// Rota para listar todos os produtos
router.get('/products', productController.getAllProducts);

// Rota para obter um produto específico pelo ID
router.get('/products/:id', productController.getProductById);

// Rota PATCH para atualizar um produto
router.patch('/products/:id', 
  upload.fields([
    { name: 'capa', maxCount: 1 },    // Imagem da capa
    { name: 'img_1', maxCount: 1 },   // Imagem 1
    { name: 'img_2', maxCount: 1 },   // Imagem 2
    { name: 'img_3', maxCount: 1 },   // Imagem 3
  ]), verificarToken, verificarRole('admin'), productController.updateProduct);

// Rota para excluir um produto
router.delete('/products/:id', verificarToken, verificarRole('admin'), productController.deleteProduct);

router.get('/filter', productController.filterProducts);

module.exports = router;
