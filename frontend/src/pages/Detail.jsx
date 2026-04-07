import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../api';
import { useCart } from '../context/CartContext';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        API.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.log("Gagal ambil detail", err));
    }, [id]);

    const handleAddToCart = async () => {
        addToCart(product);
        await Swal.fire({
            icon: 'success',
            title: 'Masuk ke keranjang',
            timer: 1200,
            showConfirmButton: false
        });
        navigate('/cart');
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f6f1e8] px-6 md:px-12 py-16">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 animate-pulse">
                    <div className="h-[520px] bg-gray-200 rounded-3xl"></div>
                    <div className="space-y-6">
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                        <div className="h-12 w-2/3 bg-gray-200 rounded"></div>
                        <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-32 w-full bg-gray-200 rounded"></div>
                        <div className="h-14 w-full bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f8f3ea] to-[#f3ece1] p-6 md:p-12">
            <div className="max-w-6xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
                
                {/* GAMBAR PRODUK */}
                <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative rounded-[35px] overflow-hidden bg-gray-100 shadow-2xl">
                        <img 
                            src={`${import.meta.env.VITE_UPLOAD_BASE_URL || 'http://localhost:5000'}/uploads/${product.image}`}
                            className="w-full h-[600px] object-cover hover:scale-110 transition-transform duration-700"
                            alt={product.name}
                            onError={(e) => e.target.src = "https://via.placeholder.com/600x800?text=Gambar+Hilang"}
                        />
                    </div>
                </div>

                {/* INFO PRODUK */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <span className="bg-black text-white px-4 py-1 rounded-full text-xs tracking-widest uppercase">{product.category}</span>
                        <h1 className="text-5xl font-brand text-gray-900 leading-tight">{product.name}</h1>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <p className="text-4xl font-black text-[#1f1a15]">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                        <p className="text-gray-400 font-bold">Stok: {product.stock} Tersedia</p>
                    </div>

                    <div className="h-2 w-24 bg-gray-900"></div>

                    <div className="space-y-4">
                        <h3 className="font-black text-lg uppercase tracking-tighter">Tentang Wangi Ini:</h3>
                        <p className="text-gray-600 text-xl leading-relaxed italic">
                            "{product.description || "Parfum eksklusif dengan karakter aroma yang unik dan tahan lama hingga 12 jam. Cocok untuk menemani setiap momen spesialmu."}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
                        <button 
                            onClick={handleAddToCart}
                            className="bg-gradient-to-r from-[#171717] to-[#2a2119] text-amber-100 py-5 rounded-2xl font-black text-xl hover:from-black hover:to-[#1c140d] transition shadow-xl active:scale-95"
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