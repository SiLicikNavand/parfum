import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';
import API from '../api';

const Cart = () => {
    const { cart, removeFromCart, updateQty, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [shipping, setShipping] = useState({
        fullName: '',
        phone: '',
        address: ''
    });
    const [shippingErrors, setShippingErrors] = useState({
        fullName: '',
        phone: '',
        address: ''
    });

    const allSelected = cart.length > 0 && selectedIds.length === cart.length;

    const selectedItems = useMemo(
        () => cart.filter((item) => selectedIds.includes(item.id)),
        [cart, selectedIds]
    );

    const totalPrice = Math.round(
        selectedItems.reduce((acc, item) => acc + (Number(item.price) * (item.qty || 1)), 0)
    );

    const toggleSelect = (id) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(allSelected ? [] : cart.map((item) => item.id));
    };

    const validateShipping = () => {
        const next = {
            fullName: shipping.fullName.trim() ? '' : 'Nama lengkap wajib diisi',
            phone: shipping.phone.trim() ? '' : 'Nomor HP wajib diisi',
            address: shipping.address.trim() ? '' : 'Alamat lengkap wajib diisi'
        };
        setShippingErrors(next);
        return !next.fullName && !next.phone && !next.address;
    };

    const handleShippingChange = (field, value) => {
        setShipping((prev) => ({ ...prev, [field]: value }));
        if (shippingErrors[field]) {
            setShippingErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleProceedToPayment = async (e) => {
        e.preventDefault();

        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        if (!user) {
            await Swal.fire({ icon: 'warning', title: 'Silakan login dulu' });
            return navigate('/login');
        }

        if (!selectedItems.length) {
            return Swal.fire({ icon: 'info', title: 'Pilih minimal 1 item untuk checkout' });
        }

        if (totalPrice < 10000) {
            return Swal.fire({ icon: 'warning', title: 'Minimal checkout Rp 10.000' });
        }

        if (!validateShipping()) {
            return Swal.fire({ icon: 'warning', title: 'Lengkapi data pengiriman', text: 'Semua field wajib diisi.' });
        }

        setLoading(true);
        try {
            const fullName = shipping.fullName.trim();
            const phone = shipping.phone.trim();
            const address = shipping.address.trim();
            const shippingAddress = `${fullName} | ${phone} | ${address}`;
            const payloadItems = selectedItems.map((item) => ({
                productId: item.id,
                quantity: item.qty || 1,
                productName: item.name,
                productImage: item.image,
                productPrice: Number(item.price)
            }));

            const res = await API.post('/payment/create-invoice', {
                amount: totalPrice,
                customerEmail: user.email || `${user.username}@gmail.com`,
                description: `Wangiin Order - ${user.username} | ${fullName} | ${phone} | ${address}`,
                itemSummary: selectedItems.map((item) => `${item.name} x${item.qty || 1}`).join(', '),
                items: payloadItems,
                shipping_address: shippingAddress
            });

            if (res.data?.invoiceUrl) {
                const pendingOrder = {
                    items: selectedItems.map((i) => ({ ...i, qty: i.qty || 1 })),
                    shipping: { fullName, phone, address },
                    total: totalPrice
                };
                localStorage.setItem('wangiin_pending_order', JSON.stringify(pendingOrder));
                window.location.href = res.data.invoiceUrl;
            }
        } catch (err) {
            const msg = err.response?.data?.detail || err.response?.data?.message || "Server Backend Mati atau Tidak Ada Internet!";
            Swal.fire({ icon: 'error', title: 'Checkout gagal', text: msg });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const trx = searchParams.get('trx');

        const markPaidFromRedirect = async () => {
            if (paymentStatus === 'success' && trx) {
                try {
                    await API.patch(`/payment/mark-paid/${trx}`);
                    await Swal.fire({
                        icon: 'success',
                        title: 'Pembayaran berhasil',
                        text: 'Status transaksi sudah diperbarui ke PAID.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    const rawPendingOrder = localStorage.getItem('wangiin_pending_order');
                    const pendingOrder = rawPendingOrder ? JSON.parse(rawPendingOrder) : null;
                    const paidAt = new Date();
                    const eta = new Date(paidAt);
                    eta.setDate(eta.getDate() + 3);

                    const orderStatus = {
                        status: 'PAID',
                        paidAt: paidAt.toISOString(),
                        estimatedDelivery: eta.toISOString(),
                        items: pendingOrder?.items || [],
                        shipping: pendingOrder?.shipping || null,
                        total: pendingOrder?.total || 0
                    };

                    localStorage.setItem('wangiin_last_paid_order', JSON.stringify(orderStatus));
                    localStorage.removeItem('wangiin_pending_order');
                    clearCart();
                    navigate('/shop', { replace: true, state: { orderStatus } });
                } catch (err) {
                    console.error(err);
                } finally {
                    setSearchParams({});
                }
            }

            if (paymentStatus === 'failed') {
                await Swal.fire({
                    icon: 'error',
                    title: 'Pembayaran belum berhasil',
                    text: 'Kamu bisa ulangi checkout kapan saja dari keranjang.'
                });
                setSearchParams({});
            }
        };

        markPaidFromRedirect();
    }, [searchParams, setSearchParams, clearCart, navigate]);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_50%)] pointer-events-none" />
                <h2 className="text-4xl font-brand text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-6 relative z-10">Keranjang masih kosong</h2>
                <Link
                    to="/shop"
                    className="relative z-10 px-10 py-3 rounded-full border border-amber-500/40 text-amber-200 tracking-[0.2em] uppercase text-xs font-semibold hover:bg-amber-500/10 hover:shadow-[0_0_24px_rgba(245,158,11,0.35)] transition-all duration-500"
                >
                    Belanja Sekarang
                </Link>
            </div>
        );
    }

    const inputClass =
        'w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-amber-50 placeholder:text-zinc-600 outline-none transition-all focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40';

    return (
        <div className="min-h-screen bg-[#050508] pt-10 pb-16 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_rgba(245,158,11,0.08),_transparent_45%)] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[60%] h-[40%] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 relative z-10">
                <div className="lg:col-span-2 space-y-4">
                    <header className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-brand text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100">
                            Keranjang Belanja
                        </h1>
                        <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-lg border border-amber-500/30 text-amber-200/90 hover:bg-amber-500/10 hover:border-amber-400/50 transition-all"
                        >
                            {allSelected ? 'Batalkan Semua' : 'Checkout Semua'}
                        </button>
                    </header>

                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 bg-zinc-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.45)]"
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => toggleSelect(item.id)}
                                className="w-4 h-4 accent-amber-500"
                            />
                            <div className="w-20 h-20 flex-shrink-0 bg-zinc-800 rounded-xl overflow-hidden border border-white/10">
                                <img
                                    src={`${import.meta.env.VITE_UPLOAD_BASE_URL || 'http://localhost:5000'}/uploads/${item.image}`}
                                    className="w-full h-full object-cover"
                                    alt={item.name}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-zinc-100 truncate">{item.name}</h3>
                                <p className="text-sm text-zinc-500">
                                    {item.category} • Rp {Number(item.price).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => updateQty(item.id, -1)}
                                    className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 border border-white/10 hover:border-amber-500/40"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center text-zinc-200">{item.qty || 1}</span>
                                <button
                                    type="button"
                                    onClick={() => updateQty(item.id, 1)}
                                    className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 border border-white/10 hover:border-amber-500/40"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-rose-400/90 text-sm hover:text-rose-300 shrink-0"
                            >
                                Hapus
                            </button>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-zinc-900/95 via-[#0a0a0c] to-black p-8 sticky top-24 shadow-[0_0_60px_rgba(0,0,0,0.75),0_0_1px_rgba(245,158,11,0.35)] backdrop-blur-xl">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

                        <h2 className="text-2xl font-brand mb-2 text-amber-100">Ringkasan</h2>
                        <p className="text-xs text-zinc-500 uppercase tracking-[0.25em] mb-4">Secure checkout</p>
                        <p className="text-sm text-zinc-400">Item dipilih: {selectedItems.length}</p>
                        <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                            Rp {totalPrice.toLocaleString('id-ID')}
                        </p>

                        <form onSubmit={handleProceedToPayment} className="mt-8 space-y-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-400/90 mb-3">
                                Pengiriman
                            </p>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5">Nama Lengkap</label>
                                <input
                                    type="text"
                                    autoComplete="name"
                                    className={inputClass}
                                    placeholder="Nama penerima"
                                    value={shipping.fullName}
                                    onChange={(e) => handleShippingChange('fullName', e.target.value)}
                                />
                                {shippingErrors.fullName && (
                                    <p className="mt-1 text-xs text-rose-400">{shippingErrors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5">Nomor HP</label>
                                <input
                                    type="tel"
                                    autoComplete="tel"
                                    className={inputClass}
                                    placeholder="08xxxxxxxxxx"
                                    value={shipping.phone}
                                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                                />
                                {shippingErrors.phone && (
                                    <p className="mt-1 text-xs text-rose-400">{shippingErrors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5">Alamat Lengkap</label>
                                <textarea
                                    rows={3}
                                    autoComplete="street-address"
                                    className={`${inputClass} resize-none`}
                                    placeholder="Jalan, RT/RW, kelurahan, kode pos..."
                                    value={shipping.address}
                                    onChange={(e) => handleShippingChange('address', e.target.value)}
                                />
                                {shippingErrors.address && (
                                    <p className="mt-1 text-xs text-rose-400">{shippingErrors.address}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-[0.2em] bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black shadow-[0_0_28px_rgba(245,158,11,0.35)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] disabled:opacity-50 disabled:shadow-none transition-all border border-amber-300/30"
                            >
                                {loading ? 'Memproses...' : 'Proceed to Payment'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
