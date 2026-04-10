const { Op } = require('sequelize');
const { Transaction, User, Product } = require('../models');

const formatTransactionWithRelations = (transaction, userMap, productMap) => {
    const plain = transaction.get({ plain: true });
    const items = Array.isArray(plain.items) ? plain.items : [];
    const productIds = [...new Set(items.map((item) => Number(item.productId)).filter(Boolean))];
    const products = productIds.map((id) => productMap.get(id)).filter(Boolean);

    return {
        ...plain,
        user: plain.User || userMap.get(plain.user_id) || null,
        products,
        itemsDetailed: items.map((item) => {
            const productId = Number(item.productId) || null;
            const product = productId ? productMap.get(productId) : null;
            return {
                productId,
                quantity: Number(item.quantity) || 0,
                productName: item.productName || product?.name || '-',
                productImage: item.productImage || product?.image || '',
                productPrice: Number(item.productPrice ?? product?.price ?? 0),
                product
            };
        })
    };
};

const getTransactionsWithRelations = async (where = {}) => {
    const transactions = await Transaction.findAll({
        where,
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'email', 'role']
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    const allProductIds = [...new Set(
        transactions.flatMap((trx) =>
            (Array.isArray(trx.items) ? trx.items : [])
                .map((item) => Number(item.productId))
                .filter(Boolean)
        )
    )];

    const products = allProductIds.length
        ? await Product.findAll({
            where: { id: { [Op.in]: allProductIds } },
            attributes: ['id', 'name', 'image', 'price', 'category']
        })
        : [];

    const productMap = new Map(products.map((product) => [Number(product.id), product.get({ plain: true })]));
    const userMap = new Map(
        transactions
            .map((trx) => trx.User)
            .filter(Boolean)
            .map((user) => [Number(user.id), user.get({ plain: true })])
    );

    return transactions.map((trx) => formatTransactionWithRelations(trx, userMap, productMap));
};

exports.getTransactions = async (req, res) => {
    try {
        const where = req.user?.role === 'admin' ? {} : { user_id: req.user.id };
        const data = await getTransactionsWithRelations(where);
        return res.status(200).json({ success: true, data });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data transaksi',
            error: err.message
        });
    }
};

exports.getMyTransactions = async (req, res) => {
    try {
        const data = await getTransactionsWithRelations({ user_id: req.user.id });
        return res.status(200).json({ success: true, data });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil riwayat transaksi user',
            error: err.message
        });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
        }

        await transaction.destroy();
        return res.status(200).json({ success: true, message: 'Transaksi berhasil dihapus.' });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus transaksi',
            error: err.message
        });
    }
};

exports.deleteAllTransactions = async (req, res) => {
    try {
        await Transaction.destroy({ where: {}, truncate: true });
        return res.status(200).json({ success: true, message: 'Semua riwayat transaksi berhasil dihapus.' });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus semua transaksi',
            error: err.message
        });
    }
};
