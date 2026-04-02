const express = require("express");
const bcrypt = require("bcrypt"); // 🔥 pakai bcrypt (bukan bcryptjs)
const jwt = require("jsonwebtoken");

// 🔥 pakai file kamu (huruf kecil)
const User = require("../models/user");

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("REQ BODY:", req.body);

    // validasi input
    if (!username || !password) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // 🔥 cari user
    const user = await User.findOne({
      where: { username: username }
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    console.log("INPUT PASSWORD:", password);
    console.log("HASH DB:", user.password);

    // 🔥 compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    // 🔥 generate token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      "rahasia_jwt",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;