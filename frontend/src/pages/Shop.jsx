import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const { addToCart, cart } = useCart();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, []);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20">
            {/* Hero Header */}
            <div className="pt-32 pb-20 px-10 text-center">
                <h1 className="text-[120px] font-black text-gray-900 leading-none uppercase tracking-tighter italic opacity-5 select-none absolute left-0 right-0 top-10 pointer-events-none">EXQUISITE</h1>
                <h2 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter relative z-10">
                    The <span className="text-indigo-600">Collection</span>
                </h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Premium Fragrances for Professionals</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {products.map((product) => (
                    <div key={product.id} className="group relative bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                        {/* Image Container */}
                        <div className="aspect-[4/5] rounded-[30px] overflow-hidden bg-gray-50 mb-6 relative">
                            <img 
                                src={`http://localhost:5000/uploads/${product.image}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt={product.name}
                                onError={(e) => e.target.src="https://via.placeholder.com/400x500?text=Perfume"}
                            />
                            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                                {product.category || 'Luxury'}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-2 mb-6">
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic leading-none">{product.name}</h3>
                            <p className="text-gray-400 text-xs font-medium line-clamp-1 italic">{product.description || 'A unique scent for every occasion.'}</p>
                            <p className="text-2xl font-black text-indigo-600 pt-2">
                                Rp {Number(product.price).toLocaleString('id-ID')}
                            </p>
                        </div>

                        {/* Button */}
                        <button 
                            onClick={() => addToCart(product)}
                            className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                        >
                            <span>Add To Collection</span>
                            <span className="text-lg">→</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;