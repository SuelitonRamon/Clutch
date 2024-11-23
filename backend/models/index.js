const {sequelize, DataTypes} = require('../config/database'); // Não é necessário importar Sequelize, apenas DataTypes

// Certifique-se de passar a instância 'sequelize' e não a classe 'Sequelize'
const Product = require('./product')(sequelize, DataTypes); // Corrigido o caminho
const User = require('./user')(sequelize, DataTypes); // Corrigido o caminho
const Cart = require('./cart')(sequelize, DataTypes); // Corrigido o caminho
const CartItem = require('./cartItem')(sequelize, DataTypes); // Corrigido o caminho

// Relacionamentos
Cart.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' }); // Correção aqui, deve ser 'User'
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'itens' });

CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'produto' });

sequelize.sync(); // Sincroniza os modelos com o banco de dados

module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  CartItem,
};