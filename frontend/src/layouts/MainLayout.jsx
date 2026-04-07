import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f5f2] flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-[#111] text-gray-300 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Wangiin. Crafted for luxury fragrance lovers.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;