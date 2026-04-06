import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar Muncul di Atas */}
      <Navbar />

      {/* Konten Halaman (Shop, Detail, Cart) Muncul di Sini */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer Sederhana */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Parfum Shop Ujikom. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;