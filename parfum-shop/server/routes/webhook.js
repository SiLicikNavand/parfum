router.post('/xendit-webhook', (req, res) => {
    const { status, external_id } = req.body;

    if (status === 'PAID') {
        console.log(`✅ PESANAN ${external_id} SUDAH LUNAS!`);
        // Di sini kamu bisa update database: Order.update({ status: 'PAID' })
    }

    res.status(200).send('OK');
});