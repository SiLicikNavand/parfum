import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.log("Gagal ambil detail", err));
    }, [id]);

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const isExist = cart.find(item => item.id === product.id);

        if (!isExist) {
            cart.push({ ...product, qty: 1 });
            localStorage.setItem('cart', JSON.stringify(cart));
            alert("🛍️ Berhasil masuk ke keranjang!");
            navigate('/cart');
        } else {
            alert("Barang ini sudah ada di keranjang!");
        }
    };

    if (!product) return <div className="h-screen flex items-center justify-center font-black text-gray-300 text-3xl animate-pulse">MEMUAT PARFUM...</div>;

    return (
        <div className="min-h-screen bg-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                
                {/* GAMBAR PRODUK */}
                <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative rounded-[35px] overflow-hidden bg-gray-100 shadow-2xl">
                        <img 
                            src={`http://localhost:5000/uploads/${product.image}`} 
                            className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                            alt={product.name}
                            onError={(e) => e.target.src = "https://via.placeholder.com/600x800?text=Gambar+Hilang"}
                        />
                    </div>
                </div>

                {/* INFO PRODUK */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">{product.category}</span>
                        <h1 className="text-6xl font-black text-gray-900 leading-none uppercase">{product.name}</h1>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <p className="text-4xl font-black text-indigo-600">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                        <p className="text-gray-400 font-bold">Stok: {product.stock} Tersedia</p>
                    </div>

                    <div className="h-2 w-24 bg-gray-900"></div>

                    <div className="space-y-4">
                        <h3 className="font-black text-lg uppercase tracking-tighter">Tentang Wangi Ini:</h3>
                        <p className="text-gray-600 text-xl leading-relaxed italic">
                            "{product.description || "Parfum eksklusif dengan karakter aroma yang unik dan tahan lama hingga 12 jam. Cocok untuk menemani setiap momen spesialmu."}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8">
                        <button 
                            onClick={handleAddToCart}
                            className="bg-gray-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-600 transition shadow-xl active:scale-95"
                        >
                            ADD TO CART
                        </button>
                        <button 
                            onClick={() => navigate(-1)}
                            className="border-4 border-gray-900 text-gray-900 py-5 rounded-2xl font-black text-xl hover:bg-gray-100 transition active:scale-95"
                        >
                            BACK
                        </button>
                    </div>

                    <div className="pt-10 border-t border-gray-100 flex gap-8">
                        <div>
                            <p className="text-2xl font-black text-gray-900 uppercase">Original</p>
                            <p className="text-xs font-bold text-gray-400">AUTHENTIC FRAGRANCE</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900 uppercase">Long Lasting</p>
                            <p className="text-xs font-bold text-gray-400">UP TO 12 HOURS</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;