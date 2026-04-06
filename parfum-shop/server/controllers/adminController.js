const { Product, User } = require('../models');

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("📊 System: Fetching Global Statistics...");

        // Menghitung data real dari database
        const totalProducts = await Product.count();
        const totalUsers = await User.count({ where: { role: 'customer' } });
        const totalAdmins = await User.count({ where: { role: 'admin' } });

        // Simulasi data transaksi (bisa diupdate kalau tabel transaksi sudah ada)
        const totalOrders = 24; 
        const totalRevenue = 5400000;

        res.status(200).json({
            success: true,
            message: "Statistics Synchronized",
            data: {
                products: totalProducts,
                customers: totalUsers,
                admins: totalAdmins,
                orders: totalOrders,
                revenue: totalRevenue,
                serverStatus: "Active",
                lastUpdate: new Date().toLocaleString()
            }
        });
    } catch (err) {
        console.error("🔥 DATABASE_ERROR:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error: Statistik Gagal Dimuat",
            error: err.message
        });
    }
};