import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    // 1. STATE UNTUK FORM DATA
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    const navigate = useNavigate();

    // 2. FUNGSI HANDLE SUBMIT (LOGIN LOGIC)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(''); // Reset error setiap kali mencoba login

        console.log("🚀 Mencoba Login ke Backend...");

        try {
            // Mengirim data ke API Backend Port 5000
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username: username,
                password: password
            });

            console.log("✅ LOGIN BERHASIL:", res.data);

            // SIMPAN DATA SAKTI KE LOCALSTORAGE (WAJIB BUAT KERANJANG & XENDIT)
            localStorage.setItem('token', res.data.token);
            // Simpan object user (ID, Username, Role)
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Alert Sukses yang Keren
            alert(`Selamat Datang Kembali, ${res.data.user.username}! ✨`);

            // CEK ROLE: Jika admin ke Dashboard, jika user ke Katalog Shop
            if (res.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/shop');
            }

        } catch (err) {
            console.error("❌ ERROR LOGIN:", err.response?.data || err.message);
            
            // Tangkap pesan error dari backend
            const message = err.response?.data?.message || "Koneksi ke server gagal!";
            setErrorMsg(message);
            
            alert("GAGAL LOGIN: " + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
            {/* Background Decor (Aura Indigo) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-50"></div>
            </div>

            <div className="w-full max-w-md">
                {/* CARD LOGIN */}
                <div className="bg-white rounded-[45px] shadow-2xl p-12 border border-gray-100 relative overflow-hidden">
                    
                    {/* Header Form */}
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-200 rotate-6 group hover:rotate-0 transition-transform duration-500">
                            <span className="text-white text-3xl font-black italic">P</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 leading-none uppercase tracking-tighter italic">Sign In</h1>
                        <p className="text-gray-400 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Parfum Shop Exclusive</p>
                    </div>

                    {/* Pesan Error Jika Gagal */}
                    {errorMsg && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl animate-shake">
                            <p className="text-red-600 text-xs font-bold uppercase tracking-widest">{errorMsg}</p>
                        </div>
                    )}

                    {/* FORM INPUT */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Username Account</label>
                            <input 
                                type="text" 
                                placeholder="Enter your username..." 
                                className="w-full p-5 bg-gray-50 border-none rounded-[25px] focus:ring-2 focus:ring-indigo-600 font-bold text-gray-700 transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Secure Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="w-full p-5 bg-gray-50 border-none rounded-[25px] focus:ring-2 focus:ring-indigo-600 font-bold text-gray-700 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-6 rounded-[25px] font-black text-xl hover:bg-indigo-600 transition-all duration-500 shadow-xl active:scale-95 disabled:bg-gray-400 flex items-center justify-center gap-3 uppercase tracking-tighter italic"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Checking...</span>
                                    </>
                                ) : (
                                    "Login Now"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-10 text-center space-y-4">
                        <p className="text-gray-400 text-sm font-medium">
                            Belum punya akun? 
                            <Link to="/register" className="ml-2 text-indigo-600 font-black hover:underline underline-offset-4">REGISTER</Link>
                        </p>
                        <div className="h-px w-20 bg-gray-100 mx-auto"></div>
                        <button 
                            onClick={() => navigate('/shop')}
                            className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] hover:text-indigo-600 transition-colors"
                        >
                            ← Back to Catalogue
                        </button>
                    </div>
                </div>

                {/* Copyright Decor */}
                <p className="text-center mt-10 text-gray-300 text-[10px] font-bold uppercase tracking-[0.5em]">
                    S*CKSOCKS • PARFUM • 2026
                </p>
            </div>
        </div>
    );
};

export default Login;