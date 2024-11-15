const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.get('/protegida', authController.verificarToken, (req, res) => {
    res.json({ mensagem: 'Você acessou uma rota protegida!', usuario: req.usuario });
});

module.exports = router;
