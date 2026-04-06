const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Product, Category } = require('../models'); // Mengambil model yang sudah berelasi
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // Menggunakan middleware profesional

// --- 1. KONFIGURASI PENYIMPANAN GAMBAR (Poin C.34) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'parfum-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas 2MB agar server tidak berat
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya file gambar (JPG/PNG/WEBP) yang diizinkan!'));
        }
    }
});

// --- 2. ROUTE: AMBIL SEMUA PRODUK (Public) ---
// Termasuk data Kategori (Eager Loading) agar poin A.5 terpenuhi
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category, as: 'category', attributes: ['name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data produk: " + err.message });
    }
});

// --- 3. ROUTE: DETAIL PRODUK PER ID (Public) ---
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Category, as: 'category' }]
        });
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan!" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 4. ROUTE: TAMBAH PRODUK BARU (Admin Only - Poin B.30) ---
router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, categoryId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Wajib mengupload gambar produk!" });
        }

        const newProduct = await Product.create({
            name,
            price: parseFloat(price),
            description,
            categoryId: categoryId, // Menggunakan ID Kategori dari database
            image: req.file.filename
        });

        res.status(201).json({ 
            message: "Produk Berhasil Ditambahkan ke Katalog!", 
            data: newProduct 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menambah produk: " + err.message });
    }
});

// --- 5. ROUTE: UPDATE PRODUK (Admin Only) ---
router.put('/:id', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan!" });

        const { name, price, description, categoryId } = req.body;
        let imageName = product.image;

        // Jika ada gambar baru, hapus gambar lama dan pakai yang baru
        if (req.file) {
            const oldPath = path.join(__dirname, '../uploads/', product.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            imageName = req.file.filename;
        }

        await product.update({
            name,
            price: parseFloat(price),
            description,
            categoryId,
            image: imageName
        });

        res.status(200).json({ message: "Produk berhasil diperbarui!", data: product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 6. ROUTE: HAPUS PRODUK (Admin Only) ---
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan!" });

        // Hapus file gambar dari server
        const filePath = path.join(__dirname, '../uploads/', product.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await product.destroy();
        res.status(200).json({ message: "Produk berhasil dihapus dari sistem!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;