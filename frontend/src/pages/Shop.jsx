import { useMemo, useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import API from '../api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState(null);
    const { category } = useParams();
    const location = useLocation();

    useEffect(() => {
        API.get('/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const stateStatus = location.state?.orderStatus;
        if (stateStatus) {
            setOrderStatus(stateStatus);
            return;
        }

        const saved = localStorage.getItem('wangiin_last_paid_order');
        if (saved) {
            try {
                setOrderStatus(JSON.parse(saved));
            } catch (err) {
                console.error(err);
            }
        }
    }, [location.state]);

    const formatDate = (raw) => {
        if (!raw) return '-';
        const dateObj = new Date(raw);
        if (Number.isNaN(dateObj.getTime())) return '-';
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(dateObj);
    };

    const hideOrderStatus = () => {
        setOrderStatus(null);
        localStorage.removeItem('wangiin_last_paid_order');
    };

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
            {orderStatus && (
                <div className="max-w-7xl mx-auto px-6 mb-10">
                    <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-zinc-900/90 via-[#0b0b0e] to-black p-6 md:p-8 shadow-[0_0_70px_rgba(0,0,0,0.65),0_0_1px_rgba(245,158,11,0.4)] backdrop-blur-xl">
                        <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.45em] text-amber-500/80 mb-2">Order Update</p>
                                <h3 className="text-2xl font-brand text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100">
                                    Payment Confirmed
                                </h3>
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 text-xs font-semibold tracking-[0.22em] uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                                    Status: {orderStatus.status}
                                </div>
                                <p className="mt-3 text-zinc-300 text-sm">
                                    Estimated Delivery: <span className="text-amber-300 font-semibold">{formatDate(orderStatus.estimatedDelivery)}</span>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={hideOrderStatus}
                                className="self-start text-xs uppercase tracking-[0.25em] text-zinc-500 hover:text-amber-400 transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>

                        {orderStatus.items?.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-3">Paid Items</p>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {orderStatus.items.map((item) => (
                                        <div key={item.id} className="rounded-2xl border border-white/5 bg-black/35 px-4 py-3">
                                            <p className="text-zinc-100 font-semibold truncate">{item.name}</p>
                                            <p className="text-zinc-500 text-xs mt-1">Qty {item.qty || 1}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

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