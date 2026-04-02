const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/admin-test", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Halo Admin 👑" });
});

module.exports = router;
