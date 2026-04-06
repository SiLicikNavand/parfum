const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Pastikan path model benar
const jwt = require('jsonwebtoken');

// --- ROUTE REGISTER (Bikin User Baru) ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await User.create({ username, password, role: 'user' });
        res.status(201).json({ message: "Berhasil Register!", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Gagal Register: " + err.message });
    }
});

// --- ROUTE LOGIN (PENYEBAB ERROR 401) ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Cari user di database
        const user = await User.findOne({ where: { username } });

        // 2. Jika user tidak ada atau password salah
        if (!user || user.password !== password) { 
            // Note: Kalau pakai bcrypt, pakai bcrypt.compare
            return res.status(401).json({ message: "Username atau Password Salah!" });
        }

        // 3. Jika benar, buat token & kirim data
        const token = jwt.sign({ id: user.id, role: user.role }, "rahasia_jwt_kamu", { expiresIn: '1d' });
        
        res.status(200).json({
            message: "Login Berhasil!",
            token: token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

module.exports = router;