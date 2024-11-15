const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// Criar um novo usuário
router.post('/', userController.createUser);

// Obter todos os usuários
router.get('/', userController.getUsers);

// Obter um usuário pelo ID
router.get('/:id', userController.getUserById);

// Atualizar um usuário pelo ID
router.put('/:id', userController.updateUser);

// Deletar um usuário pelo ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
