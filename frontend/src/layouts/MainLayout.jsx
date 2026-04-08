import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black font-sans">
      <Navbar />
      <main className="flex-grow relative">
        {/* Efek Cahaya Latar Futuristik */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <Outlet />
      </main>
      <footer className="bg-black/50 backdrop-blur-lg border-t border-white/5 text-gray-500 py-10 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-brand text-2xl text-amber-100/50 mb-2 tracking-widest">WANGIIN</p>
          <p className="text-xs tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} Crafted for luxury fragrance lovers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;