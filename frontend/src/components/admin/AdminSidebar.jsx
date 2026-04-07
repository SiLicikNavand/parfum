import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReceiptText, LogOut, PlusCircle } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Tambah Produk', path: '/admin/products', icon: <PlusCircle size={20} /> },
    { name: 'Transaksi', path: '/admin/transactions', icon: <ReceiptText size={20} /> },
  ];

  return (
    <aside className="w-72 bg-white text-gray-900 min-h-screen flex flex-col sticky top-0 border-r border-gray-200">
      <div className="p-8 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black">W</div>
        <div>
          <h1 className="font-semibold">Admin Panel</h1>
          <p className="text-xs text-gray-500">Wangiin</p>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition text-sm ${
              location.pathname === item.path ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-6">
        <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-lg transition text-sm">
          <LogOut className="inline mr-2" size={14}/> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;