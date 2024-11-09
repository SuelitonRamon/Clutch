const {DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,  // Certifique-se de que a coluna `name` não possa ser nula
    }
  });
  
  return Category;
};
