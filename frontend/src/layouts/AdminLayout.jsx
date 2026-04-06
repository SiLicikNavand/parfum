import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar - Fix di kiri */}
      <AdminSidebar />

      {/* Konten Utama */}
      <div className="flex-1">
        {/* Header Atas */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="text-slate-800 font-bold text-xl uppercase tracking-wider">
              Kontrol Panel
            </h2>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 leading-none">Navand Admin</p>
              <p className="text-xs text-slate-500 mt-1 font-medium italic">navand@parfum.com</p>
            </div>
            <div className="w-12 h-12 rounded-full ring-2 ring-indigo-100 p-1">
              <img 
                src="https://ui-avatars.com/api/?name=Navand+Admin&background=4f46e5&color=fff" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Tempat render halaman-halaman admin (Dashboard, Produk, dll) */}
        <main className="p-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;