import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // State lengkap: Username, Email, Password, dan Role
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        role: 'customer' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // POST ke Backend (Sesuaikan Port 5000)
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            alert(res.data.message || "Registrasi Berhasil!");
            navigate('/login'); 
        } catch (error) {
            console.error("Error Detail:", error.response?.data);
            alert(error.response?.data?.message || "Gagal Registrasi! Periksa koneksi atau data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100">
                <h2 className="text-3xl font-black text-center text-indigo-600 mb-8 uppercase tracking-tight italic">CREATE ACCOUNT</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* INPUT USERNAME */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Username</label>
                        <input 
                            type="text" required
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
                            placeholder="Username baru"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    {/* INPUT EMAIL */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                            type="email" required
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    {/* INPUT PASSWORD */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Password</label>
                        <input 
                            type="password" required
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {/* PILIHAN ROLE (ADMIN / CUSTOMER) */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Daftar Sebagai</label>
                        <select 
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 cursor-pointer"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="customer">🛍️ CUSTOMER (PEMBELI)</option>
                            <option value="admin">👑 ADMIN (PENGELOLA)</option>
                        </select>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 mt-4 uppercase italic tracking-tighter text-lg"
                    >
                        {loading ? 'Processing...' : 'REGISTER NOW'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Sudah punya akun? 
                    <Link to="/login" className="text-indigo-600 hover:underline ml-2 font-black">LOGIN</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;