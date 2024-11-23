const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { verificarToken } = require('../controllers/authController');  // Middleware de autenticação
const { verificarRole } = require('../controllers/authController');  // Middleware de autorização

// Rotas públicas
router.post('/', userController.createUser); // A criação de usuários pode ser pública

// Rotas protegidas com verificação de token e role
router.get('/', verificarToken, verificarRole('admin'), userController.getUsers); // Apenas admin pode acessar
router.get('/:id', verificarToken, verificarRole('admin'), userController.getUserById); // Apenas admin pode acessar
router.patch('/:id', verificarToken, verificarRole('admin'), userController.updateUser); // Apenas admin pode acessar
router.delete('/:id', verificarToken, verificarRole('admin'), userController.deleteUser); // Apenas admin pode acessar

module.exports = router;