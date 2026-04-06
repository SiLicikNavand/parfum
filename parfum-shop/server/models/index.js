const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./Product');

// Jika ada relasi nanti tambahkan di sini
// Contoh: User.hasMany(Product);

module.exports = {
    sequelize,
    User,
    Product
};