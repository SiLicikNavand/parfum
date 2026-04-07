const express = require('express');
const router = express.Router();
const path = require('path');
const dotenv = require('dotenv');
const { Xendit } = require('xendit-node');
const { Transaction } = require('../models');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// --- INISIALISASI XENDIT SAKTI ---
const xenditClient = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY || ''
});

const { Invoice } = xenditClient;

router.post('/create-invoice', async (req, res) => {
    try {
        if (!process.env.XENDIT_SECRET_KEY) {
            return res.status(500).json({ message: 'XENDIT_SECRET_KEY tidak tersedia di environment.' });
        }

        const { amount, customerEmail, description, itemSummary } = req.body;

        console.log("-----------------------------------------");
        console.log("🚀 [SYSTEM] MEMPROSES PESANAN BARU");
        console.log("💰 TOTAL   :", amount);
        console.log("📧 EMAIL   :", customerEmail);

        // 1. VALIDASI NOMINAL (Wajib Bulat & Minimal 10.000)
        const finalAmount = Math.floor(Number(amount));
        if (isNaN(finalAmount) || finalAmount < 10000) {
            console.error("❌ ERROR: Nominal tidak valid atau di bawah Rp 10.000");
            return res.status(400).json({ 
                message: "Gagal!", 
                detail: "Total belanja minimal Rp 10.000 untuk pembayaran online." 
            });
        }

        // 2. DATA UNTUK XENDIT (FORMAT SDK V3)
        const externalId = `INV-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
        const frontendBaseUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
        const invoicePayload = {
            data: {
                externalId,
                amount: finalAmount,
                payerEmail: customerEmail || "pembeli@gmail.com",
                description: description || "Pembayaran Wangiin",
                invoiceDuration: 86400, // Aktif 24 jam
                currency: 'IDR',
                successRedirectUrl: `${frontendBaseUrl}/cart?payment=success&trx=${externalId}`,
                failureRedirectUrl: `${frontendBaseUrl}/cart?payment=failed&trx=${externalId}`
            }
        };

        // 3. KIRIM KE XENDIT
        console.log("📡 Sedang menghubungi server Xendit...");
        const response = await Invoice.createInvoice(invoicePayload);

        await Transaction.create({
            external_id: externalId,
            amount: finalAmount,
            status: 'PENDING',
            payment_url: response.invoiceUrl
        });

        console.log("✅ INVOICE BERHASIL DIBUAT!");
        console.log("🔗 URL PEMBAYARAN:", response.invoiceUrl);
        console.log("-----------------------------------------");
        
        // Kirim link pembayaran ke frontend
        return res.status(200).json({ invoiceUrl: response.invoiceUrl, externalId });

    } catch (err) {
        console.error("-----------------------------------------");
        console.error("❌ [SERVER ERROR] TERJADI KENDALA:");
        
        // --- LOGIKA ANTI-CRASH (SOLUSI ERROR 500 KAMU) ---
        let statusCode = 500;
        let errorMessage = "Terjadi kesalahan internal pada server backend.";
        let errorDetail = err.message;

        // Cek apakah error berasal dari respon Xendit
        if (err.response && err.response.data) {
            statusCode = err.response.status || 500;
            errorDetail = err.response.data.message || "Xendit menolak permintaan invoice.";
            console.error("Detail Error Xendit:", JSON.stringify(err.response.data, null, 2));
        } else {
            // Error ini biasanya karena internet laptop mati atau API Key salah ketik
            console.error("Pesan Error Asli:", err.message);
        }

        console.error("-----------------------------------------");

        // Kirim respon ke frontend tanpa bikin server Node.js mati/crash
        return res.status(statusCode).json({
            message: "Gagal membuat invoice",
            detail: errorDetail
        });
    }
});

// Fallback update status jika webhook terlambat/tidak masuk
router.patch('/mark-paid/:externalId', async (req, res) => {
    try {
        const { externalId } = req.params;
        const transaction = await Transaction.findOne({ where: { external_id: externalId } });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
        }

        await transaction.update({ status: 'PAID' });
        return res.status(200).json({ message: 'Transaksi berhasil ditandai PAID.' });
    } catch (err) {
        return res.status(500).json({ message: 'Gagal update status transaksi.', error: err.message });
    }
});

module.exports = router;