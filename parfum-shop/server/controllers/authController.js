const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER SAKTI
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Cek input kosong
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Data tidak lengkap!" });
        }

        // Cek apakah user sudah ada
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar!" });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan ke DB
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        res.status(201).json({ message: "Registrasi Berhasil!", user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal Register", error: err.message });
    }
};

// 2. LOGIN SAKTI
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari User
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: "Username tidak ditemukan!" });

        // Cek Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah!" });

        // Buat Token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'rahasia_parfum_123',
            { expiresIn: '1d' }
        );

        // Response BALIKAN (Sangat penting buat frontend)
        res.json({
            message: "Login Berhasil!",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error saat Login", error: err.message });
    }
};