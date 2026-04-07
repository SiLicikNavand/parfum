const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    image: { 
        type: DataTypes.STRING,
        defaultValue: 'default_perfume.jpg'
    },
    category: {
        type: DataTypes.ENUM('Men', 'Women', 'Unisex'),
        defaultValue: 'Unisex'
    },
    type: {
        type: DataTypes.ENUM('Collab', 'New Release', 'Best Seller'),
        defaultValue: 'New Release'
    }
}, { 
    tableName: 'products',
    timestamps: true 
});

module.exports = Product;