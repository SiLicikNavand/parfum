const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    // Kolom ID otomatis dibuat oleh Sequelize
    username: {
        type: DataTypes.STRING,
        allowAll: false,
        unique: true // Tidak boleh ada username kembar
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user' // Defaultnya jadi pembeli biasa
    }
}, {
    // PENTING: Paksa nama tabel di database jadi 'users' (huruf kecil semua)
    tableName: 'users',
    // Sequelize akan otomatis mengurus kolom createdAt dan updatedAt
    timestamps: true 
});

module.exports = User;