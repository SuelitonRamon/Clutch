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
        const token = jwt.sign({ id: usuario.id, nome: usuario.nome, role: usuario.role }, SECRET_KEY, { expiresIn: '8h' });

        return res.json({ mensagem: 'Login bem-sucedido!', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno ao gerar token' });
    }
};

// Middleware para proteger rotas
exports.verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ mensagem: 'Token não fornecido!' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.usuario = decoded; // Salva os dados do token no objeto req
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token inválido!' });
    }
};

exports.verificarRole = (roleRequerida) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado!' });
        }

        console.log('Role do usuário:', req.usuario.role);  // Log para verificar a role do usuário

        if (req.usuario.role !== roleRequerida) {
            return res.status(403).json({ mensagem: 'Acesso negado! Permissão insuficiente.' });
        }

        next(); // Usuário autenticado e autorizado
    };
};

exports.authMiddleware = async (req, res, next) => {
    try {
      // Pegar o token do header
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }
  
      // Formato do header: "Bearer <token>"
      const [, token] = authHeader.split(' ');
  
      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }
  
      try {
        // Verificar token (substitua 'sua_chave_secreta' pela sua chave real)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
        
        // Buscar usuário
        const user = await User.findByPk(decoded.id);
        
        if (!user) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }
  
        // Adicionar usuário à requisição
        req.user = user;
        
        return next();
      } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erro na autenticação' });
    }
  };
  