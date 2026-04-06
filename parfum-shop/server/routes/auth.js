const express = require('express');
const router = express.Router();
// Memanggil controller yang sudah kita buat tadi
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Mendaftarkan user baru (Customer atau Admin)
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user dan mendapatkan Token JWT
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me (Opsional untuk cek profil)
 * @desc    Mendapatkan data user yang sedang login
 * @access  Private (Butuh middleware verifyToken)
 */
// const { verifyToken } = require('../middleware/authMiddleware');
// router.get('/me', verifyToken, (req, res) => {
//     res.json({ user: req.user });
// });

module.exports = router;