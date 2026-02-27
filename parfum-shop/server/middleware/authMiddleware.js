const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  const token = authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Format token salah" });
  }

  jwt.verify(token, "RAHASIA_JWT", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    req.user = decoded; // simpan id & role
    next();
  });
};

module.exports = authMiddleware;
