const express = require('express');
const router = express.Router();
// Import controller yang menangani logika statistik
const adminController = require('../controllers/adminController');

// Pastikan penulisan endpoint-nya benar
// URL: http://localhost:5000/api/admin/dashboard
router.get('/dashboard', adminController.getDashboardStats);

/** * Jika kedepannya kamu butuh proteksi (hanya admin yang bisa akses), 
 * kamu bisa tambahkan middleware di sini:
 * router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboardStats);
 */

module.exports = router;