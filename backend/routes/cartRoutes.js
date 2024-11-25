const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verificarToken } = require('../controllers/authController'); // Middleware de autenticação

// Todas as rotas requerem autenticação
router.use(verificarToken);

// Rotas do carrinho
router.get('/', cartController.getOrCreateCart);
router.post('/add', cartController.addItem);
router.put('/item', cartController.updateItemQuantity);
router.delete('/item/:cartItemId', cartController.removeItem);
router.post('/checkout', cartController.checkout);

module.exports = router;