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

    const handleCheckout = async () => {
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

        setLoading(true);
        try {
            const res = await API.post('/payment/create-invoice', {
                amount: totalPrice,
                customerEmail: user.email || `${user.username}@gmail.com`,
                description: `Wangiin Order - ${user.username}`,
                itemSummary: selectedItems.map((item) => `${item.name} x${item.qty || 1}`).join(', ')
            });

            if (res.data?.invoiceUrl) {
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
                    clearCart();
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
    }, [searchParams, setSearchParams, clearCart]);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f5f2] p-10">
                <h2 className="text-4xl font-brand text-gray-900 mb-6">Keranjang masih kosong</h2>
                <Link to="/shop" className="bg-black text-white px-10 py-3 rounded-full">
                    Belanja Sekarang
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f8f3ea] via-[#f2ebdf] to-[#f8f3ea] pt-10 pb-16 px-6 md:px-12">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <header className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-brand text-gray-900">Keranjang Belanja</h1>
                        <button onClick={toggleSelectAll} className="text-sm px-3 py-1 bg-white/90 border border-amber-200 rounded-lg">
                            {allSelected ? 'Batalkan Semua' : 'Checkout Semua'}
                        </button>
                    </header>

                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white/90 backdrop-blur p-4 rounded-xl border border-amber-100 shadow-sm">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => toggleSelect(item.id)}
                                className="w-4 h-4"
                            />
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                <img 
                                    src={`${import.meta.env.VITE_UPLOAD_BASE_URL || 'http://localhost:5000'}/uploads/${item.image}`}
                                    className="w-full h-full object-cover"
                                    alt={item.name}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.category} • Rp {Number(item.price).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 bg-gray-100 rounded">-</button>
                                <span className="w-8 text-center">{item.qty || 1}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 bg-gray-100 rounded">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">Hapus</button>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="bg-gradient-to-b from-[#171717] to-[#090909] text-white p-8 rounded-2xl sticky top-24 shadow-2xl">
                        <h2 className="text-2xl font-brand mb-6">Ringkasan</h2>
                        <p className="text-sm text-gray-400">Item dipilih: {selectedItems.length}</p>
                        <p className="text-3xl font-bold mt-2">Rp {totalPrice.toLocaleString('id-ID')}</p>
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full mt-6 bg-gradient-to-r from-amber-300 to-yellow-500 text-black py-3 rounded-lg font-semibold disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;