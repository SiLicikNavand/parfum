import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert(`Selamat Datang Kembali, ${res.data.user.username}! ✨`);

            if (res.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/shop');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Username atau Password salah!';
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-amber-50 placeholder:text-zinc-600 outline-none transition-all focus:border-amber-500/55 focus:ring-1 focus:ring-amber-500/30';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050508] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(245,158,11,0.1),_transparent_50%)] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[70%] max-w-2xl h-[45%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-b from-zinc-900/95 via-[#0a0a0c] to-black p-10 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.65),0_0_1px_rgba(245,158,11,0.35)] backdrop-blur-xl">
                    <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/45 to-transparent" />

                    <div className="text-center mb-10">
                        <p className="text-[10px] uppercase tracking-[0.45em] text-amber-500/80 mb-3">Wangiin Exclusive</p>
                        <h2 className="text-4xl font-brand text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100">
                            Sign In
                        </h2>
                        <p className="text-zinc-500 text-xs mt-3 tracking-widest uppercase">Luxury access · Dark member portal</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-300">{errorMsg}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.25em] ml-1">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                className={inputClass}
                                placeholder="Username kamu"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.25em] ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className={inputClass}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-4 rounded-2xl font-semibold text-sm uppercase tracking-[0.2em] bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black shadow-[0_0_28px_rgba(245,158,11,0.35)] hover:shadow-[0_0_40px_rgba(245,158,11,0.45)] disabled:opacity-50 disabled:shadow-none transition-all border border-amber-300/25"
                        >
                            {loading ? 'Processing...' : 'Login Now'}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-zinc-500 text-xs font-medium uppercase tracking-[0.2em]">
                        Belum punya akun?
                        <Link to="/register" className="text-amber-400 hover:text-amber-300 ml-2 font-semibold transition-colors">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;