import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { ShoppingCart, LogOut, User as UserIcon, Search } from 'lucide-react';

const Navbar = () => {
    const { cart } = useCart(); 
    const navigate = useNavigate();
    const location = useLocation();

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const handleLogout = () => {
        if (window.confirm("Yakin ingin mengakhiri pengalaman belanja Anda?")) {
            localStorage.clear();
            navigate('/login');
        }
    };

    return (
        <nav className="bg-white/70 backdrop-blur-2xl py-6 px-10 md:px-20 sticky top-0 z-[100] border-b border-gray-100/50 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            
            {/* LOGO BRAND - High Fashion Style */}
            <Link to="/shop" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl group-hover:bg-indigo-600 transition-all duration-700 group-hover:rotate-[360deg]">
                    <span className="text-white font-black italic text-2xl tracking-tighter">S</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-[0.2em] text-gray-900 uppercase italic leading-none">
                        Parfum<span className="text-indigo-600 font-light">.</span>
                    </span>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.5em] mt-1">L'Exclusif Shop</span>
                </div>
            </Link>

            {/* NAVIGASI MENU - Minimalist Center */}
            <div className="hidden lg:flex items-center gap-16 bg-gray-50/50 px-10 py-3 rounded-full border border-gray-100">
                {['Shop', 'Categories', 'Journal', 'Contact'].map((item) => (
                    <Link 
                        key={item}
                        to={`/${item.toLowerCase()}`} 
                        className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 hover:text-indigo-600 relative group ${
                            location.pathname === `/${item.toLowerCase()}` ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                    >
                        {item}
                        <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-500 group-hover:w-full ${location.pathname === `/${item.toLowerCase()}` ? 'w-full' : ''}`}></span>
                    </Link>
                ))}
            </div>

            {/* USER CONTROL SECTION */}
            <div className="flex items-center gap-8">
                {/* SEARCH ICON */}
                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Search size={20} strokeWidth={2.5} />
                </button>

                {/* CART - High Performance Badge */}
                <Link to="/cart" className="relative group p-2">
                    <ShoppingCart size={22} strokeWidth={2.5} className="text-gray-900 group-hover:text-indigo-600 transition-all duration-500" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xl animate-pulse">
                            {cart.length}
                        </span>
                    )}
                </Link>

                {/* AUTH STATUS */}
                {user ? (
                    <div className="flex items-center gap-6 pl-8 border-l border-gray-100">
                        <div className="flex flex-col text-right">
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Member</span>
                            <span className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">{user.username}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-sm"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link 
                        to="/login" 
                        className="group relative overflow-hidden bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all duration-500 shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:shadow-indigo-200"
                    >
                        <span className="relative z-10">Access Portal</span>
                        <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;