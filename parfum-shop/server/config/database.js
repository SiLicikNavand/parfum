const path = require('path');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load .env agar variabel DB_PORT bisa terbaca
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME || 'parfum',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        // --- INI YANG TADI KURANG ---
        port: process.env.DB_PORT || 3307, 
        // ----------------------------
        dialect: 'mysql',
        logging: false 
    }
);

module.exports = sequelize;