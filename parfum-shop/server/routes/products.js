const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// =======================
// CONFIG MULTER
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// =======================
// GET ALL PRODUCTS
// =======================
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// CREATE PRODUCT + IMAGE
// =======================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file); // 🔥 DEBUG

    const { name, price, stock } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      stock,
      image: req.file ? req.file.filename : null
    });

    res.json(newProduct);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Error upload" });
  }
});

// =======================
// UPDATE PRODUCT + IMAGE
// =======================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("FILE UPDATE:", req.file);

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const { name, price, stock } = req.body;

    await product.update({
      name,
      price,
      stock,
      image: req.file ? req.file.filename : product.image
    });

    res.json(product);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Error update" });
  }
});

// =======================
// DELETE PRODUCT
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await product.destroy();

    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Error delete" });
  }
});

module.exports = router;