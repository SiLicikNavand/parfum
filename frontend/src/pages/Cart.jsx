import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQty, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. HITUNG TOTAL & PASTIKAN JADI ANGKA BULAT
    const totalPrice = Math.round(cart.reduce((acc, item) => acc + (Number(item.price) * (item.qty || 1)), 0));

    // 2. FUNGSI CHECKOUT
    const handleCheckout = async () => {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        if (!user) {
            alert("🔒 AKSES DITOLAK: Silakan Login terlebih dahulu!");
            return navigate('/login');
        }

        if (totalPrice < 10000) {
            return alert("⚠️ NOMINAL MINIMAL: Total belanja minimal Rp 10.000 untuk bayar via Xendit.");
        }

        setLoading(true);
        console.log("🚀 Menghubungi server backend Port 5000...");

        try {
            // Panggil API Backend (URL Lengkap)
            const res = await axios.post('http://localhost:5000/api/payment/create-invoice', {
                amount: totalPrice,
                customerEmail: user.email || `${user.username}@gmail.com`,
                description: `Exclusive Order - Customer: ${user.username}`
            });

            if (res.data) {
                console.log("✅ Sukses! Mengalihkan ke Gerbang Pembayaran...");
                window.location.href = res.data; 
            }
        } catch (err) {
            console.error("❌ Checkout Gagal:", err);
            
            // Tangkap pesan detail dari backend sakti kita
            const msg = err.response?.data?.detail || err.response?.data?.message || "Server Backend Mati atau Tidak Ada Internet!";
            alert(`⛔ GAGAL: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    // 3. UI JIKA KOSONG
    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 relative overflow-hidden">
                <div className="text-[250px] font-black text-gray-50 absolute opacity-50 select-none tracking-tighter italic uppercase -z-0">EMPTY</div>
                <h2 className="text-5xl font-black text-gray-900 uppercase italic z-10 mb-8 tracking-tighter leading-none">Your Bag Is Empty</h2>
                <Link to="/shop" className="bg-indigo-600 text-white px-16 py-6 rounded-[35px] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all z-10 shadow-2xl active:scale-95">
                    Start Shopping
                </Link>
            </div>
        );
    }

    // 4. UI UTAMA (PANJANG & PREMIUM)
    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-[1400px] mx-auto grid lg:grid-cols-3 gap-20">
                
                {/* LIST BARANG (KIRI) */}
                <div className="lg:col-span-2 space-y-12">
                    <header className="border-b-8 border-black pb-10 mb-14">
                        <h1 className="text-8xl font-black uppercase italic tracking-tighter leading-none text-gray-900">My <span className="text-indigo-600">Bag</span></h1>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.5em] text-[10px] mt-4 italic">Hand-picked Luxury Fragrances</p>
                    </header>

                    {cart.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center gap-12 bg-white p-12 rounded-[60px] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-700 relative">
                            {/* GAMBAR PRODUK */}
                            <div className="w-52 h-52 flex-shrink-0 bg-gray-50 rounded-[45px] overflow-hidden shadow-inner border border-gray-100">
                                <img 
                                    src={`http://localhost:5000/uploads/${item.image}`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" 
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src="https://placehold.co/600x600/f3f4f6/6366f1?text=Perfume";
                                    }}
                                />
                            </div>

                            {/* DETAIL INFO */}
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 leading-none">{item.category || 'Luxury Collection'}</p>
                                <h3 className="text-4xl font-black text-gray-900 uppercase italic leading-none mb-6 tracking-tighter">{item.name}</h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
                                    <div className="flex items-center bg-gray-100 rounded-2xl p-2 border border-gray-200">
                                        <button onClick={() => updateQty(item.id, -1)} className="w-12 h-12 bg-white rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition active:scale-90 shadow-sm">-</button>
                                        <span className="w-16 text-center font-black text-2xl text-gray-900 leading-none">{item.qty || 1}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="w-12 h-12 bg-white rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition active:scale-90 shadow-sm">+</button>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-2">Subtotal Item</p>
                                        <p className="text-3xl font-black text-gray-900 italic tracking-tighter">Rp {(item.price * (item.qty || 1)).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* DELETE BUTTON */}
                            <button onClick={() => removeFromCart(item.id)} className="absolute top-10 right-10 text-gray-200 hover:text-red-500 transition-all transform hover:rotate-90 p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* BOX TOTAL (KANAN) */}
                <div className="relative">
                    <div className="bg-gray-900 text-white p-14 rounded-[70px] h-fit sticky top-36 shadow-2xl overflow-hidden border border-gray-800">
                        {/* Glow effect aesthetic */}
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-600 blur-[120px] opacity-30 -z-0 rounded-full"></div>

                        <h2 className="text-4xl font-black mb-12 uppercase italic border-b border-gray-800 pb-10 relative z-10 tracking-tighter">Summary</h2>
                        
                        <div className="space-y-8 mb-16 relative z-10">
                            <div className="flex justify-between items-center text-gray-500 font-bold uppercase tracking-[0.2em] text-[11px]">
                                <span>Subtotal</span>
                                <span className="text-white text-2xl italic tracking-tighter font-black">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 font-bold uppercase tracking-[0.2em] text-[11px]">
                                <span>Shipping Fee</span>
                                <span className="text-green-400 text-xl italic tracking-tighter font-black uppercase">Free</span>
                            </div>
                        </div>

                        <div className="pt-14 border-t border-gray-800 relative z-10">
                            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] mb-4">Total Amount Payable:</p>
                            <div className="text-7xl font-black italic text-white mt-4 tracking-tighter mb-16">Rp {totalPrice.toLocaleString('id-ID')}</div>
                            
                            <button 
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-white text-black py-8 rounded-[40px] font-black text-2xl uppercase tracking-tighter hover:bg-indigo-500 hover:text-white transition-all duration-700 active:scale-95 disabled:bg-gray-700 relative z-10 shadow-xl shadow-indigo-900/20"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-7 h-7 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                                        <span>PROCESSING...</span>
                                    </div>
                                ) : "PAY NOW"}
                            </button>
                        </div>

                        <div className="mt-16 flex justify-center gap-10 opacity-20 grayscale hover:grayscale-0 transition-all duration-1000 relative z-10">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" className="h-7" alt="qris" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-5" alt="visa" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;