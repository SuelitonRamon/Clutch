const { User } = require('../models');

// Criar um novo usuário
createUser = async (req, res) => {
  try {
    const { nome, email, senha, googleId, nickname, role, foto } = req.body;

    // Verificar se o email ou nickname já existem
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const existingNickname = await User.findOne({ where: { nickname } });
    if (existingNickname) {
      return res.status(400).json({ error: 'Nickname já em uso' });
    }

    // Criar o usuário
    const newUser = await User.create({ nome, email, senha, googleId, nickname, role, foto });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Obter todos os usuários
getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Obter um usuário pelo ID
getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// Atualizar um usuário
updateUser = async (req, res) => {
  try {
    const { nome, email, senha, googleId, nickname, role, foto } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar informações do usuário
    user.nome = nome || user.nome;
    user.email = email || user.email;
    user.senha = senha || user.senha;
    user.googleId = googleId || user.googleId;
    user.nickname = nickname || user.nickname;
    user.role = role || user.role;
    user.foto = foto || user.foto;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Deletar um usuário
deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
  };