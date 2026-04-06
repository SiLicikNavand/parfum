import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // POST ke Backend Port 5000
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      alert(res.data.message);
      navigate('/login'); // Setelah daftar, langsung lempar ke Login
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Gagal Registrasi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-black text-center text-indigo-600 mb-8">DAFTAR AKUN</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">USERNAME BARU</label>
            <input 
              type="text" required
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all"
              placeholder="Masukkan username"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">PASSWORD BARU</label>
            <input 
              type="password" required
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all"
              placeholder="Masukkan password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Mendaftarkan...' : 'DAFTAR SEKARANG'}
          </button>
        </form>
        <p className="text-center mt-6 text-slate-500">
          Sudah punya akun? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;