import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section className="h-screen relative overflow-hidden flex items-center">
            {/* Background Image Futuristik */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-[#050505]" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 text-center md:text-left animate-fade-in-up">
                <div className="inline-block border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
                    <p className="tracking-[0.35em] uppercase text-[10px] font-bold text-amber-400">The Future of Fragrance</p>
                </div>
                <h1 className="font-brand text-6xl md:text-8xl leading-tight max-w-4xl text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    Elegance, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Redefined.</span>
                </h1>
                <p className="max-w-xl mt-8 text-gray-400 text-lg leading-relaxed font-light">
                    Koleksi mahakarya parfum eksklusif. Dirancang dengan presisi untuk memancarkan aura kemewahan di setiap partikel aromanya.
                </p>
                <div className="mt-12 flex flex-col md:flex-row items-center gap-6 md:justify-start justify-center">
                    <Link to="/shop" className="relative group px-10 py-4 overflow-hidden rounded-full bg-amber-500 text-black font-bold tracking-widest uppercase text-sm">
                        <span className="relative z-10">Discover Collection</span>
                        <div className="absolute inset-0 bg-amber-300 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                    </Link>
                    <Link to="/shop/collab" className="group flex items-center gap-3 text-sm uppercase tracking-widest text-gray-300 hover:text-amber-400 transition-colors">
                        <span className="w-12 h-[1px] bg-gray-500 group-hover:bg-amber-400 transition-colors duration-500"></span>
                        View Collaborations
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Home;