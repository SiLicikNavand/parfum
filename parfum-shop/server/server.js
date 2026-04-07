// 1. Load Environment Variables (WAJIB DI ATAS SENDIRI)
const path = require('path');
const dotenv = require('dotenv');
// Memastikan path ke .env absolut agar tidak salah baca
dotenv.config({ path: path.resolve(__dirname, '.env') });

const fs = require('fs');
const express = require('express');
const cors = require('cors');

// 2. Import Koneksi & Models (index.js otomatis terpanggil)
const { sequelize } = require('./models'); 

// --- 3. IMPORT SEMUA ROUTES ---
// Pastikan file-file ini ada di folder routes/
const authRoutes = require('./routes/auth'); 
const productRoutes = require('./routes/productRoutes'); 
const adminRoutes = require('./routes/admin'); 
const paymentRoutes = require('./routes/paymentRoutes'); 
const webhookRoutes = require('./routes/webhook'); 

const app = express();

// --- 4. MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- 5. SETUP FOLDER UPLOAD (UNTUK GAMBAR PRODUK) ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Folder 'uploads' berhasil disiapkan.");
}
app.use('/uploads', express.static(uploadDir));

// --- 6. PENDAFTARAN API ENDPOINTS ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);

// --- 7. RUNNING SERVER & DATABASE ---
const PORT = process.env.PORT || 5000;

// LOG DEBUG UNTUK CEK ENV (Navand, cek ini di terminal nanti!)
console.log("---------------------------------------");
console.log('🔍 INFO: CEK KONFIGURASI .ENV');
console.log('📡 DB_HOST    :', process.env.DB_HOST || 'localhost');
console.log('📦 DB_NAME    :', process.env.DB_NAME || 'parfum');
console.log('🔑 XENDIT KEY :', process.env.XENDIT_SECRET_KEY ? 'TERDETEKSI ✅' : 'TIDAK ADA ❌');
console.log("---------------------------------------");

// Mencoba koneksi ke MySQL XAMPP
sequelize.authenticate()
    .then(() => {
        console.log("✅ DATABASE: CONNECTED (Suksess!)");
        
        // sync({ alter: true }) otomatis update tabel jika ada perubahan di model
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("✅ TABLES  : SYNCED (Tabel Siap)");
        app.listen(PORT, () => {
            console.log(`🚀 SERVER  : RUNNING ON PORT ${PORT}`);
            console.log("---------------------------------------");
        });
    })
    .catch(err => {
        console.log("❌ ERROR KONEKSI DATABASE TERDETEKSI:");
        console.log("Pesan Error :", err.message);
        console.log("Kode Error  :", err.original ? err.original.code : 'UNKNOWN');
        console.log("---------------------------------------");
        console.log("TIPS: Pastikan XAMPP Hijau & MySQL80 di Services sudah STOP.");
    });