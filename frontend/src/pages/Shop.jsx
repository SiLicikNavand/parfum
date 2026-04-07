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
        <div className="min-h-screen bg-[#f6f1e8] py-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-amber-100 animate-pulse">
                        <div className="h-56 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f8f3ea] via-[#f3ede3] to-[#f8f3ea] pb-20">
            <div className="pt-16 pb-10 px-10 text-center">
                <h2 className="font-brand text-5xl text-gray-900">
                    {category ? `${category.toUpperCase()} Collection` : 'Luxury Shop'}
                </h2>
                <p className="text-gray-500 uppercase tracking-[0.25em] text-xs mt-4">Wangiin Premium Catalog</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="group relative bg-white/90 backdrop-blur rounded-xl p-5 shadow-lg border border-amber-100 hover:shadow-2xl hover:-translate-y-1 transition overflow-hidden">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 mb-6 relative">
                            <img 
                                src={`${import.meta.env.VITE_UPLOAD_BASE_URL || 'http://localhost:5000'}/uploads/${product.image}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={product.name}
                                onError={(e) => e.target.src="https://via.placeholder.com/400x500?text=Perfume"}
                            />
                            <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-amber-100">
                                {product.category || 'Luxury'}
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{product.description || 'A unique scent for every occasion.'}</p>
                            <p className="text-xl font-bold text-[#161616] pt-2">
                                Rp {Number(product.price).toLocaleString('id-ID')}
                            </p>
                        </div>

                        <div className="absolute left-5 right-5 bottom-5 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <Link to={`/product/${product.id}`} className="block text-center w-full bg-gradient-to-r from-[#171717] to-[#2a2119] text-amber-100 py-3 rounded-xl hover:from-black hover:to-[#1c140d] transition">
                                Detail
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;