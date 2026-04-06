import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  LogOut, 
  PackageSearch 
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Produk', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Pesanan', path: '/admin/orders', icon: <PackageSearch size={20} /> },
    { name: 'Customer', path: '/admin/users', icon: <Users size={20} /> },
  ];

  const handleLogout = () => {
    // Menghapus data login dari local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect ke halaman login
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 min-h-screen flex flex-col sticky top-0 shadow-xl">
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-black text-xl">P</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">Parfum Shop</h1>
          <p className="text-xs text-slate-500 font-medium">Administrator</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold' 
                : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-6 mt-auto border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-3 rounded-xl transition-all duration-300 font-semibold border border-rose-500/20"
        >
          <LogOut size={18} />
          Keluar Sesi
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;