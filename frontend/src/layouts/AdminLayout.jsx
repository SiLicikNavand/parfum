import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800">Wangiin Admin</h2>
        </header>
        <main className="p-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;