const adminMiddleware = (req, res, next) => {
    // req.user didapatkan dari middleware verifyToken sebelumnya
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Akses Ditolak! Anda bukan Admin." });
    }
    next();
};

module.exports = adminMiddleware;