import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { category } = useParams();

    useEffect(() => {
        API.get('/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, []);

    const filteredProducts = useMemo(() => {
        if (!category) return products;
        const normalized = category.toLowerCase();
        if (normalized === 'collab') {
            return products.filter((item) => item.type?.toLowerCase() === 'collab');
        }
        return products.filter((item) => item.category?.toLowerCase() === normalized);
    }, [products, category]);

    if (loading) return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse backdrop-blur-sm">
                        <div className="aspect-[3/4] bg-white/10 rounded-xl mb-6"></div>
                        <div className="h-5 bg-white/20 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2 mb-6"></div>
                        <div className="h-10 bg-white/20 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-20 relative z-10">
            <div className="px-6 text-center mb-16 animate-fade-in-up">
                <h2 className="font-brand text-5xl md:text-6xl text-white drop-shadow-md">
                    {category ? `${category.toUpperCase()}` : 'THE COLLECTION'}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-6"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="group relative bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-amber-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.3)]">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black relative mb-5">
                            <img 
                                src={`${import.meta.env.VITE_UPLOAD_BASE_URL || 'http://localhost:5000'}/uploads/${product.image}`}
                                className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 ease-out"
                                alt={product.name}
                                onError={(e) => e.target.src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800"}
                            />
                            
                            {/* Kategori Badge */}
                            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-200">
                                {product.category || 'Luxury'}
                            </div>

                            {/* Tombol Hover Tengah (Futuristik) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <Link to={`/product/${product.id}`} className="translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-xs uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:bg-amber-500 hover:text-black hover:border-amber-500">
                                    View Details
                                </Link>
                            </div>
                        </div>

                        <div className="text-center px-2 pb-2">
                            <h3 className="text-lg font-brand text-gray-100 group-hover:text-amber-400 transition-colors duration-300">{product.name}</h3>
                            <p className="text-amber-500/80 font-mono text-sm mt-2 tracking-wider">
                                IDR {Number(product.price).toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;