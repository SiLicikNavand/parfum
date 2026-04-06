const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

// --- KONFIGURASI PENYIMPANAN GAMBAR (MULTER) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Nama file unik: timestamp + ekstensi asli
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb('Error: Hanya Gambar (JPG/PNG/WEBP) yang diperbolehkan!');
        }
    }
});

// --- MIDDLEWARE VERIFIKASI TOKEN ---
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Akses Ditolak! Silakan Login Dahulu." });

    jwt.verify(token, "rahasia_jwt_kamu", (err, user) => {
        if (err) return res.status(403).json({ message: "Token Kadaluarsa!" });
        req.user = user;
        next();
    });
};

// --- ROUTE: AMBIL SEMUA PRODUK (HOME/USER) ---
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data: " + err.message });
    }
});

// --- ROUTE: DETAIL PRODUK PER ID ---
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan!" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ROUTE: TAMBAH PRODUK BARU (ADMIN) ---
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, price, stock, description, category } = req.body;
        
        // Cek jika file ada
        if (!req.file) {
            return res.status(400).json({ message: "Wajib mengupload gambar produk!" });
        }

        const newProduct = await Product.create({
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            description,
            category: category || 'Unisex',
            image: req.file.filename // Simpan nama filenya saja
        });

        res.status(201).json({ 
            message: "Produk Berhasil Ditambahkan!", 
            data: newProduct 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

// --- ROUTE: HAPUS PRODUK ---
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan!" });

        // Hapus file fisik dari folder uploads
        const filePath = path.join(__dirname, '../uploads/', product.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await product.destroy();
        res.status(200).json({ message: "Produk berhasil dihapus!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;