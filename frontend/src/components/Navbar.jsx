import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Memanggil data dari context

const Navbar = () => {
    const { cart } = useCart(); // Ambil array cart
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil data user dari localStorage untuk cek status login
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    // Fungsi Logout
    const handleLogout = () => {
        if (window.confirm("Yakin ingin keluar dari akun?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert("Berhasil keluar. Sampai jumpa lagi!");
            navigate('/login');
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md py-5 px-6 md:px-12 sticky top-0 z-[100] border-b border-gray-100 flex justify-between items-center shadow-sm">
            
            {/* LOGO BRAND */}
            <Link to="/shop" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    <span className="text-white font-black italic text-xl">S</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">
                    Parfum<span className="text-indigo-600">Shop</span>
                </span>
            </Link>

            {/* NAVIGASI MENU */}
            <div className="hidden md:flex items-center gap-12">
                <Link 
                    to="/shop" 
                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${location.pathname === '/shop' ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
                >
                    Catalogue
                </Link>
                
                {/* ICON KERANJANG (CART) DENGAN BADGE ANGKA */}
                <Link to="/cart" className="relative group p-2">
                    <span className="text-2xl transition-transform group-hover:scale-110 inline-block">🛒</span>
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                            {cart.length}
                        </span>
                    )}
                </Link>

                {/* USER SECTION (LOGIN / LOGOUT) */}
                {user ? (
                    <div className="flex items-center gap-6 pl-6 border-l border-gray-100">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">Welcome</p>
                            <p className="text-xs font-black text-gray-900 uppercase italic">{user.username}</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-50 text-red-500 px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link 
                        to="/login" 
                        className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        Admin Login
                    </Link>
                )}
            </div>

            {/* MOBILE TOGGLE (Hanya icon untuk estetika) */}
            <div className="md:hidden text-2xl">
                ☰
            </div>
        </nav>
    );
};

export default Navbar;