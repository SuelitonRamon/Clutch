// server.js
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const { sequelize } = require('./config/database');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', productRoutes);


app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
  console.log(`Servidor rodando na porta ${port}`);
});
