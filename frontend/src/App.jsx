import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// PAGES
import Shop from './pages/Shop';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

// ADMIN PAGES
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';

// COMPONENTS
import Navbar from './components/Navbar';
import AdminSidebar from './components/AdminSidebar';
import { CartProvider } from './context/CartContext';

const AppLayout = () => {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');

    return (
        <div className={isAdminPath ? "flex bg-[#fafafa] min-h-screen" : "min-h-screen bg-white"}>
            {/* Sidebar Muncul HANYA di path Admin */}
            {isAdminPath && <AdminSidebar />}

            {/* Navbar Muncul HANYA di path Non-Admin */}
            {!isAdminPath && <Navbar />}

            <main className={isAdminPath ? "flex-1 overflow-x-hidden" : "w-full"}>
                <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route path="/" element={<Navigate to="/shop" replace />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<Detail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* PRIVATE ADMIN ROUTES */}
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/products" element={<Products />} />

                    {/* 404 PAGE */}
                    <Route path="*" element={
                        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                            <h1 className="text-[120px] font-black text-gray-100 leading-none">404</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-[0.5em] -mt-6 mb-10">Lost in Space</p>
                            <button onClick={() => window.location.href='/shop'} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl">Return Home</button>
                        </div>
                    } />
                </Routes>
            </main>
        </div>
    );
};

function App() {
    return (
        <CartProvider>
            <Router>
                <AppLayout />
            </Router>
        </CartProvider>
    );
}

export default App;