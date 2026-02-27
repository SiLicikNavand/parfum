const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'parfum_shop',   // NAMA DATABASE
  'root',          // USERNAME
  '',              // PASSWORD
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;