import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// PUBLIC PAGES
import Home from './pages/Home';
import Shop from './pages/Shop';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Login from './pages/login';
import Register from './pages/Register';

// ADMIN PAGES
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Transactions from './pages/admin/Transactions';

// LAYOUTS
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Route protector untuk halaman Admin
const ProtectedRoute = ({ children, requiredRole }) => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    // Jika belum login, paksa ke halaman login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Jika sudah login tapi bukan role yang diminta (misalnya bukan admin)
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/shop" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* LAYOUT UTAMA USER */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:category" element={<Shop />} />
                    <Route path="/product/:id" element={<Detail />} />
                    <Route path="/cart" element={<Cart />} />
                </Route>

                {/* AUTH PAGES */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* LAYOUT ADMIN + PROTECTED ROUTE */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="transactions" element={<Transactions />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;