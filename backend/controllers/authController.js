const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database'); // Ajuste o caminho para sua configuração do Sequelize
const User = require('../models/user')(sequelize); // Inicialize o modelo com o sequelize

// Chave secreta para o JWT
const SECRET_KEY = "Yp3vq00TXw6nTjhxik5";

// Login
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Buscar o usuário no banco
        const usuario = await User.findOne({ where: { email, senha } });

        if (!usuario) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas!' });
        }

        // Gerar token
        const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, SECRET_KEY, { expiresIn: '8h' });

        return res.json({ mensagem: 'Login bem-sucedido!', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno ao gerar token' });
    }
};

// Middleware para proteger rotas
exports.verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ mensagem: 'Token não fornecido!' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.usuario = decoded; // Salvar dados do token no req
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token inválido!' });
    }
};
