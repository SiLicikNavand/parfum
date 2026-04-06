const express = require('express');
const router = express.Router();
const { Order, Payment } = require('../models');

router.post('/', async (req, res) => {
    const { status, external_id } = req.body;
    console.log(`📡 WEBHOOK RECEIVED: ${external_id} - STATUS: ${status}`);

    try {
        const payment = await Payment.findOne({ where: { externalId: external_id } });
        if (payment) {
            const newStatus = status === 'PAID' ? 'PAID' : 'FAILED';
            
            // Update tabel Payment
            await payment.update({ paymentStatus: newStatus });
            
            // Update tabel Order (Relasi Poin A.5)
            await Order.update(
                { status: newStatus }, 
                { where: { id: payment.orderId } }
            );

            console.log(`✅ DATABASE UPDATED: Order #${payment.orderId} is ${newStatus}`);
        }
        res.status(200).send('OK');
    } catch (err) {
        console.error("❌ WEBHOOK ERROR:", err.message);
        res.status(500).send('Internal Error');
    }
});

module.exports = router;