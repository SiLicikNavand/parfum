const express = require('express');
const router = express.Router();
const { Transaction } = require('../models');

router.post('/', async (req, res) => {
    const status = req.body.status || req.body.invoice_status;
    const externalId = req.body.external_id || req.body.externalId;
    const normalizedStatus = String(status || '').toUpperCase();

    if (!externalId) {
        return res.status(400).send('Missing external_id');
    }
    console.log(`📡 WEBHOOK RECEIVED: ${externalId} - STATUS: ${normalizedStatus}`);

    try {
        const transaction = await Transaction.findOne({ where: { external_id: externalId } });
        if (transaction) {
            const newStatus = normalizedStatus === 'PAID' ? 'PAID' : normalizedStatus === 'PENDING' ? 'PENDING' : 'FAILED';
            await transaction.update({ status: newStatus });
            console.log(`✅ DATABASE UPDATED: Transaction ${externalId} is ${newStatus}`);
        }
        res.status(200).send('OK');
    } catch (err) {
        console.error("❌ WEBHOOK ERROR:", err.message);
        res.status(500).send('Internal Error');
    }
});

module.exports = router;