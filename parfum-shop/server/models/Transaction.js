const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    external_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'EXPIRED', 'FAILED'),
        defaultValue: 'PENDING'
    },
    payment_url: {
        type: DataTypes.STRING
    }
}, { 
    tableName: 'transactions',
    timestamps: true 
});

module.exports = Transaction;