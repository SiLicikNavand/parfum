const User = require('../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Mencoba login dengan:", username, password); // CEK DI TERMINAL

        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            return res.status(401).json({ message: 'User tidak ditemukan di database' });
        }

        // KITA PAKAI CEK PASSWORD POLOS (SANGAT SENSITIF HURUF BESAR KECIL)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            'rahasia_123',
            { expiresIn: '1d' }
        );

        res.json({ message: 'Berhasil', token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error server' });
    }
};

module.exports = { login };