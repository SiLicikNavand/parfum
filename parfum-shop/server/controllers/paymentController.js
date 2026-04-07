const path = require('path');
const dotenv = require('dotenv');

// Pastikan env terbaca dari root server
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { Order, OrderItem, Payment, Product } = require('../models');
const { Xendit } = require('xendit-node');

if (!process.env.XENDIT_SECRET_KEY) {
    console.warn('⚠️ XENDIT_SECRET_KEY tidak terdeteksi di env. Pembayaran Xendit akan gagal.');
}

const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY || '' });
const { Invoice } = xenditClient;

exports.checkout = async (req, res) => {
    try {
        const { items, customerEmail } = req.body; // items: [{productId, quantity}]
        const userId = req.user.id; // Diambil dari middleware token

        // 1. Hitung Total & Buat Order di Database
        let totalAmount = 0;
        const order = await Order.create({ userId, totalAmount: 0, status: 'PENDING' });

        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                totalAmount += product.price * item.quantity;
                await OrderItem.create({
                    orderId: order.id,
                    productId: product.id,
                    quantity: item.quantity
                });
            }
        }
        await order.update({ totalAmount });

        // 2. Buat Invoice Xendit
        const externalId = `INV-${order.id}-${Date.now()}`;
        const invoice = await Invoice.createInvoice({
            data: {
                externalId,
                amount: Math.floor(totalAmount),
                payerEmail: customerEmail,
                description: `Pembayaran Order #${order.id}`,
                invoiceDuration: 86400,
                currency: 'IDR'
            }
        });

        // 3. Simpan Info Pembayaran
        await Payment.create({
            orderId: order.id,
            externalId: externalId,
            paymentStatus: 'PENDING',
            amount: totalAmount
        });

        res.status(200).json({ invoiceUrl: invoice.invoiceUrl });
    } catch (err) {
        res.status(500).json({ message: "Checkout Gagal: " + err.message });
    }
};