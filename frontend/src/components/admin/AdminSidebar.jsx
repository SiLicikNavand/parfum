import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut, PlusCircle } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Tambah Produk', path: '/admin/products', icon: <PlusCircle size={20} /> },
  ];

  return (
    <aside className="w-72 bg-gray-900 text-white min-h-screen flex flex-col sticky top-0 shadow-2xl border-r border-gray-800">
      <div className="p-8 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-indigo-500/20">P</div>
        <div>
          <h1 className="font-black uppercase tracking-tighter italic">Admin<span className="text-indigo-500">Mode</span></h1>
          <p className="text-[8px] font-bold text-gray-500 tracking-[0.3em]">CONTROL CENTER</p>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
              location.pathname === item.path ? 'bg-indigo-600 shadow-xl shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-6">
        <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/20">
          <LogOut className="inline mr-2" size={14}/> Keluar Sesi
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;