const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    external_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    items: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'expired', 'failed'),
        defaultValue: 'pending'
    },
    payment_url: {
        type: DataTypes.STRING
    }
}, { 
    tableName: 'transactions',
    timestamps: true 
});

module.exports = Transaction;