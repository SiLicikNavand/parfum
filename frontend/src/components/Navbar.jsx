import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { cart } = useCart(); 
    const navigate = useNavigate();
    const location = useLocation();

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const handleLogout = async () => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Logout sekarang?',
            text: 'Sesi login kamu akan diakhiri.',
            showCancelButton: true,
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
        <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
                <Link to="/home" className="font-brand text-3xl tracking-wide text-amber-100">Wangiin</Link>

                <div className="hidden md:flex items-center gap-8 text-sm">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group tracking-[0.18em] uppercase text-xs transition relative pb-1 ${
                                location.pathname === item.path ? 'text-amber-200' : 'text-gray-300 hover:text-amber-100'
                            }`}
                        >
                            {item.label}
                            <span className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-amber-200 transition-all duration-500 ${
                                location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                            }`}></span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/cart" className="relative p-2 text-gray-200 hover:text-amber-200 transition">
                        <ShoppingCart size={22} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-300 to-yellow-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                                {cart.length}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <button onClick={handleLogout} className="text-gray-200 hover:text-rose-400 transition">
                            <LogOut size={20} />
                        </button>
                    ) : (
                        <Link to="/login" className="text-sm px-4 py-2 rounded-full bg-amber-200 text-black font-semibold">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;