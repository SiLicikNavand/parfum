const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// --- 1. MIDDLEWARE UTAMA ---
// Izin akses agar React (Port 5173) bisa akses Node.js (Port 5000)
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. SETUP FOLDER UPLOADS ---
// Pastikan folder 'uploads' ada, kalau gak ada dibuatin otomatis biar gak error pas simpan produk
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// Biar gambar bisa diakses lewat browser (contoh: localhost:5000/uploads/gambar.jpg)
app.use('/uploads', express.static(uploadDir));

// --- 3. JALUR API (ROUTES) ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Test koneksi server
app.get('/', (req, res) => {
    res.send('Backend ParfumShop Aktif! 🚀');
});

// --- 4. KONEKSI DATABASE & JALANKAN SERVER ---
const PORT = 5000;

// Pakai { alter: true } agar tabel otomatis update kalau ada perubahan di Model
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Database terhubung & Tabel Sinkron');
        app.listen(PORT, () => {
            console.log(`🚀 Server lari di http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Gagal konek database:', err.message);
    });