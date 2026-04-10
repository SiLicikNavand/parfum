import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const handleLogout = async () => {
        const result = await Swal.fire({
            background: '#111',
            color: '#fff',
            icon: 'question',
            title: 'Logout sekarang?',
            text: 'Sesi login kamu akan diakhiri.',
            showCancelButton: true,
            confirmButtonColor: '#d97706',
            cancelButtonColor: '#333',
            confirmButtonText: 'Ya, logout',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const navItems = [
        { label: 'Home', path: '/home' },
        { label: 'Shop', path: '/shop' },
        { label: 'Men', path: '/shop/men' },
        { label: 'Women', path: '/shop/women' },
        { label: 'Unisex', path: '/shop/unisex' },
        { label: 'Collab', path: '/shop/collab' }
    ];

    return (
        <nav className="fixed w-full top-0 z-50 bg-black/30 backdrop-blur-2xl border-b border-white/10 transition-all duration-500">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
                <Link to="/home" className="font-brand text-3xl tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 hover:scale-105 transition-transform duration-500">
                    WANGIIN
                </Link>

                <div className="hidden md:flex items-center gap-10 text-sm">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group tracking-[0.25em] uppercase text-[11px] font-medium transition-all relative py-2 ${
                                location.pathname === item.path ? 'text-amber-300' : 'text-gray-400 hover:text-amber-100'
                            }`}
                        >
                            {item.label}
                            <span
                                className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-300 ${
                                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}
                            />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-5">
                    <Link to="/cart" className="relative group p-2 text-gray-300 hover:text-amber-300 transition-colors">
                        <ShoppingCart size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                        {cart.length > 0 && (
                            <span className="absolute top-0 -right-1 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/profile"
                        className="relative group p-2 text-gray-300 hover:text-amber-300 transition-colors"
                        aria-label="Profil"
                    >
                        <User size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                    </Link>

                    {user ? (
                        <button onClick={handleLogout} className="text-gray-300 hover:text-rose-400 transition-colors group">
                            <LogOut size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="text-xs tracking-widest uppercase px-6 py-2.5 rounded-full border border-amber-500/50 text-amber-300 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-500"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
