const { Product, User, Transaction } = require('../models');

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("📊 System: Fetching Global Statistics...");

        // Menghitung data real dari database
        const totalProducts = await Product.count();
        const totalUsers = await User.count({ where: { role: 'customer' } });
        const totalAdmins = await User.count({ where: { role: 'admin' } });

        const totalOrders = await Transaction.count();
        const totalRevenue = await Transaction.sum('amount', { where: { status: 'paid' } }) || 0;

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

exports.getPaidTransactions = async (req, res) => {
    try {
        const paidTransactions = await Transaction.findAll({
            where: { status: 'paid' },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: paidTransactions
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data transaksi PAID',
            error: err.message
        });
    }
};