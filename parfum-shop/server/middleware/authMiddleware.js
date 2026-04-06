const jwt = require('jsonwebtoken');
require('dotenv').config();

// Fungsi untuk mengecek apakah user sudah login (punya token)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Akses ditolak! Token tidak ditemukan.' });
    }

    // Rahasia token diambil dari .env (kalau tidak ada, pakai default)
    const secret = process.env.JWT_SECRET || 'rahasia_parfum_super_aman_123';

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa. Silakan login ulang.' });
        }
        req.user = decoded; 
        next();
    });
};

// Fungsi khusus mengecek Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak! Fitur ini hanya untuk Admin.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };