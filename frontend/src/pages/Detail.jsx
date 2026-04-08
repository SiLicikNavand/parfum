import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../api';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';

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
            background: '#111',
            color: '#fff',
            icon: 'success',
            title: 'Added to Cart',
            text: `${product.name} has been added.`,
            timer: 1500,
            showConfirmButton: false,
            iconColor: '#f59e0b'
        });
        navigate('/cart');
    };

    if (!product) {
        return (
            <div className="min-h-screen pt-32 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 animate-pulse">
                    <div className="aspect-[4/5] bg-white/5 border border-white/10 rounded-3xl"></div>
                    <div className="space-y-8 mt-10">
                        <div className="h-6 w-32 bg-white/10 rounded-full"></div>
                        <div className="h-16 w-3/4 bg-white/10 rounded-xl"></div>
                        <div className="h-10 w-1/3 bg-white/10 rounded-xl"></div>
                        <div className="h-40 w-full bg-white/5 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 relative z-10">
            {/* Tombol Back Futuristik */}
            <div className="max-w-6xl mx-auto mb-8">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors uppercase tracking-widest text-xs font-bold">
                    <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" /> Back to Shop
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
                
                {/* GAMBAR PRODUK (Glowing Aura) */}
                <div className="relative group">
                    {/* Cahaya Belakang */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-amber-600 to-yellow-300 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl">
                        <img 
                            src={`${import.meta.env.VITE_UPLOAD_BASE_URL || 'http://localhost:5000'}/uploads/${product.image}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 ease-out opacity-90"
                            alt={product.name}
                            onError={(e) => e.target.src = "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800"}
                        />
                    </div>
                </div>

                {/* INFO PRODUK */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <span className="inline-block border border-amber-500/50 text-amber-400 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold bg-amber-500/10 backdrop-blur-sm">
                            {product.category}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-brand text-white leading-tight">{product.name}</h1>
                        <p className="text-3xl font-mono text-amber-500 tracking-wider">
                            Rp {Number(product.price).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="h-[1px] w-full bg-gradient-to-r from-white/20 to-transparent"></div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">The Essence</h3>
                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                            {product.description || "Formula rahasia dengan partikel aroma yang beradaptasi dengan suhu tubuh. Menciptakan identitas wangi eksklusif yang tak terlupakan."}
                        </p>
                    </div>

                    {/* Stock Indicator */}
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle size={18} className="text-amber-500" />
                        <span className="text-gray-300">Available in Stock ({product.stock} units)</span>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="pt-4">
                        <button 
                            onClick={handleAddToCart}
                            className="w-full relative overflow-hidden group bg-white text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:text-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <span className="relative z-10">Add to Cart</span>
                            <div className="absolute inset-0 bg-amber-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                        </button>
                    </div>

                    {/* Futuristic Perks */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                        <div>
                            <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-1">Authentic</p>
                            <p className="text-gray-500 text-xs">100% Original Extrait</p>
                        </div>
                        <div>
                            <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-1">Longevity</p>
                            <p className="text-gray-500 text-xs">Up to 24 Hours Radiance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;