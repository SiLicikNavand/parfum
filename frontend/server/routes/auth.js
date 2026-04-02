const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("REQ BODY:", req.body); // 🔥 debug

  if (!username || !password) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  User.findByUsername(username, (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = result[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "rahasia_jwt",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
    });
  });
});

module.exports = router;