const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load variabel dari file .env
dotenv.config();

// Ambil koneksi database dari folder models
const { sequelize } = require('./models'); 

// --- 1. IMPORT SEMUA ROUTES ---
const authRoutes = require('./routes/auth');        // Untuk Login & Register
const productRoutes = require('./routes/productRoutes'); // Untuk Kelola Produk
const adminRoutes = require('./routes/admin');       // UNTUK DASHBOARD (FIXED)
const paymentRoutes = require('./routes/paymentRoutes'); // Untuk Xendit (Jika ada)
const webhookRoutes = require('./routes/webhook');     // Untuk Webhook (Jika ada)

const app = express();

// --- 2. MIDDLEWARES ---
app.use(cors()); // Supaya Frontend bisa akses API
app.use(express.json()); // Supaya bisa baca body JSON
app.use(express.urlencoded({ extended: true })); // Supaya bisa baca body form-data

// --- 3. SETUP STATIC FOLDER (FOLDER UPLOAD GAMBAR) ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Folder 'uploads' dibuat otomatis.");
}
// Middleware agar gambar bisa diakses browser: http://localhost:5000/uploads/nama_file.jpg
app.use('/uploads', express.static(uploadDir));

// --- 4. PENDAFTARAN API ENDPOINTS ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);     // Route Dashboard Admin (PENTING!)
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);

// --- 5. RUNNING SERVER & DATABASE ---
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log("---------------------------------------");
        console.log("✅ DATABASE: CONNECTED");
        
        // sync({ alter: true }) otomatis nambah kolom jika ada perubahan model
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("✅ TABLES: SYNCED");
        app.listen(PORT, () => {
            console.log(`🚀 SERVER: RUNNING ON PORT ${PORT}`);
            console.log("---------------------------------------");
        });
    })
    .catch(err => {
        console.error("❌ ERROR KONEKSI DATABASE:", err.message);
    });