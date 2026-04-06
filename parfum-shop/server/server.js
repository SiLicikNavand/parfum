const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');

// --- 1. IMPORT SEMUA ROUTES ---
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// --- 2. MIDDLEWARE ANTI-BLOCKING (CORS FIX) ---
// Ini supaya Frontend Port 5173 bisa bebas ngobrol ke Backend Port 5000
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 3. STORAGE SYSTEM (UPLOAD GAMBAR) ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Folder 'uploads' berhasil dibuat otomatis.");
}

// Mengizinkan akses publik ke gambar: http://localhost:5000/uploads/nama_file.jpg
app.use('/uploads', express.static(uploadDir));

// --- 4. DAFTAR API ENDPOINTS ---
// Cek di sini kalau mau ngetes lewat Postman
app.use('/api/auth', authRoutes);       // Login & Register
app.use('/api/products', productRoutes); // Katalog & Tambah Produk
app.use('/api/payment', paymentRoutes);   // Xendit Payment Gateway

// --- 5. LOGGING SETIAP REQUEST (BUAT DEBUGGING) ---
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} request ke ${req.url}`);
    next();
});

// --- 6. GLOBAL ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error("🔥 SERVER ERROR:", err.stack);
    res.status(err.status || 500).json({ 
        message: 'Terjadi kesalahan pada sistem backend!',
        error: err.message 
    });
});

// --- 7. KONEKSI DATABASE & JALANKAN SERVER ---
const PORT = 5000;

// sequelize.sync({ alter: true }): Update tabel otomatis tanpa hapus data (jika memungkinkan)
sequelize.authenticate()
    .then(() => {
        console.log("-----------------------------------------");
        console.log("✅ DATABASE CONNECTED SUCCESSFULLY");
        
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("✅ DATABASE TABLES SYNCED");
        console.log("-----------------------------------------");
        
        app.listen(PORT, () => {
            console.log(`🚀 BACKEND RADAR RUNNING ON: http://localhost:${PORT}`);
            console.log(`📸 ACCESS IMAGES AT: http://localhost:${PORT}/uploads`);
            console.log(`💳 XENDIT GATEWAY: READY`);
            console.log("-----------------------------------------");
        });
    })
    .catch(err => {
        console.error("❌ CRITICAL ERROR: GAGAL KONEK DATABASE!");
        console.error("Pesan Error:", err.message);
        console.log("-----------------------------------------");
    });