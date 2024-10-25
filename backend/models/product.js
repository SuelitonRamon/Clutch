const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    avaliacao: {
      type: DataTypes.DECIMAL(3, 2)
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2)
    },
    genero: {
      type: DataTypes.STRING
    },
    capa: {
      type: DataTypes.STRING,
    },
    img_1: {
      type: DataTypes.STRING,
    },
    img_2: {
      type: DataTypes.STRING,
    },
    img_3: {
      type: DataTypes.STRING,
    },
    trailer: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'product', 
    timestamps: false
  });
}