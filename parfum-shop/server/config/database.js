const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('parfum_shop', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
module.exports = sequelize;