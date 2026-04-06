const jwt = require('jsonwebtoken');
require('dotenv').config();

// 🛡️ Middleware 1: Verifikasi apakah User sudah Login (Cek Token)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Cek apakah header Authorization ada dan formatnya 'Bearer <token>'
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : null;

    if (!token) {
        return res.status(403).json({ 
            message: 'Akses ditolak! Silakan login untuk mendapatkan token.' 
        });
    }

    // Ambil secret dari .env (Sangat Penting untuk Poin B.31 Ujikom)
    const secret = process.env.JWT_SECRET || 'rahasia_parfum_super_aman_123';

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                message: 'Token kadaluarsa atau tidak valid. Silakan login ulang.' 
            });
        }
        
        // Simpan hasil decode (id, role, dll) ke req.user supaya bisa dibaca route/middleware selanjutnya
        req.user = decoded; 
        next();
    });
};

// 👑 Middleware 2: Verifikasi apakah User adalah Admin (Poin B.30 Soal Ujikom)
const isAdmin = (req, res, next) => {
    // Pastikan req.user ada (hasil dari verifyToken) dan cek role-nya
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: 'Terlarang! Halaman ini hanya boleh diakses oleh Admin.' 
        });
    }
    next();
};

// Ekspor sebagai objek agar bisa di-destructure di file routes
module.exports = { verifyToken, isAdmin };