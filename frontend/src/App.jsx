import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// IMPORT PAGES
import Shop from './pages/Shop';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Login from './pages/login';
import Register from './pages/Register';

// IMPORT COMPONENTS (NAVBAR)
import Navbar from './components/Navbar';

// IMPORT ADMIN PAGES (Jika ada)
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';

function App() {
  return (
    <Router>
      {/* Navbar muncul di semua halaman */}
      <Navbar /> 
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 1. HALAMAN UTAMA (Otomatis ke Shop) */}
          <Route path="/" element={<Navigate to="/shop" />} />
          <Route path="/shop" element={<Shop />} />

          {/* 2. HALAMAN DETAIL PRODUK */}
          <Route path="/product/:id" element={<Detail />} />

          {/* 3. HALAMAN KERANJANG */}
          <Route path="/cart" element={<Cart />} />

          {/* 4. HALAMAN AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 5. HALAMAN ADMIN (Opsional) */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />

          {/* 6. JIKA URL TIDAK DITEMUKAN (ERROR 404) */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-9xl font-black text-gray-200">404</h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest">Halaman Tidak Ditemukan</p>
              <button onClick={() => window.location.href='/shop'} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl">Balik Ke Toko</button>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;