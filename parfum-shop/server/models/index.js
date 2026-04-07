const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./Product');
const Transaction = require('./Transaction');
const Category = require('./Category');

// --- RELASI DATABASE ---
// User punya banyak transaksi
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    Product,
    Transaction,
    Category
};