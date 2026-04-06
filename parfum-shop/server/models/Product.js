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
    image: { 
        type: DataTypes.STRING 
    },
    // Foreign Key ke tabel Categories (Sesuai Poin A.5 & A.23)
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, { 
    tableName: 'products',
    timestamps: true 
});

module.exports = Product;