import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-[#1a1410]/70 to-black/35" />
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-24 text-white animate-fadeInUp">
                <p className="tracking-[0.35em] uppercase text-xs text-amber-300 mb-6">Luxury Fragrance House</p>
                <h1 className="font-brand text-5xl md:text-7xl leading-tight max-w-3xl">
                    Wangiin, Signature Scent for Your Finest Moment.
                </h1>
                <p className="max-w-2xl mt-8 text-gray-100/90 text-lg leading-relaxed">
                    Temukan koleksi parfum premium dengan karakter aroma yang elegan, berkelas, dan tahan lama.
                </p>
                <div className="mt-10 flex gap-4">
                    <Link to="/shop" className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 text-black font-semibold hover:from-amber-200 hover:to-yellow-400 transition shadow-[0_0_24px_rgba(251,191,36,0.45)] hover:shadow-[0_0_34px_rgba(251,191,36,0.7)]">
                        Shop Now
                    </Link>
                    <Link to="/shop/unisex" className="px-8 py-3 rounded-full border border-amber-100/50 text-amber-100 hover:bg-white/10 transition">
                        Explore Unisex
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Home;
