const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./Product');
const Transaction = require('./Transaction');
const Category = require('./Category');

// --- RELASI DATABASE ---
// User punya banyak transaksi
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    Product,
    Transaction,
    Category
};