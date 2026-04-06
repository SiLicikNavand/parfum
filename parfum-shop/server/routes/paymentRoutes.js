const express = require('express');
const router = express.Router();
const { Xendit } = require('xendit-node');

// --- INISIALISASI XENDIT SAKTI ---
const xenditClient = new Xendit({
    secretKey: 'xnd_public_development_CnF6QhjeF4p6F2ETENTCICQnwYUO4RFqL0230UBZWgMUbZatbW_A970FEq5EmMI' 
});

const { Invoice } = xenditClient;

router.post('/create-invoice', async (req, res) => {
    try {
        const { amount, customerEmail, description } = req.body;

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
        const invoicePayload = {
            data: {
                externalId: `INV-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
                amount: finalAmount,
                payerEmail: customerEmail || "pembeli@gmail.com",
                description: description || "Pembayaran Exclusive Parfum Shop",
                invoiceDuration: 86400, // Aktif 24 jam
                currency: 'IDR',
                successRedirectUrl: 'http://localhost:5173/cart',
                failureRedirectUrl: 'http://localhost:5173/cart'
            }
        };

        // 3. KIRIM KE XENDIT
        console.log("📡 Sedang menghubungi server Xendit...");
        const response = await Invoice.createInvoice(invoicePayload);

        console.log("✅ INVOICE BERHASIL DIBUAT!");
        console.log("🔗 URL PEMBAYARAN:", response.invoiceUrl);
        console.log("-----------------------------------------");
        
        // Kirim link pembayaran ke frontend
        return res.status(200).json(response.invoiceUrl);

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

module.exports = router;