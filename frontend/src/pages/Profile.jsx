import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import API from '../api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState('');

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (!raw) {
            navigate('/login', { replace: true });
            return;
        }
        try {
            setUser(JSON.parse(raw));
        } catch {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const res = await API.get('/payment/my-transactions');
                setOrders(res.data?.data || []);
            } catch (err) {
                setOrdersError(err.response?.data?.message || 'Gagal memuat riwayat pesanan.');
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050508] text-zinc-400">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            </div>
        );
    }

    const roleLabel = user.role === 'admin' ? 'Administrator' : 'Customer';

    return (
        <div className="min-h-screen bg-[#050508] pt-28 pb-20 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(245,158,11,0.12),_transparent_55%)] pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(90vw,720px)] h-[320px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-zinc-900/90 via-[#0c0c0f] to-black p-10 shadow-[0_0_80px_rgba(0,0,0,0.6),0_0_1px_rgba(245,158,11,0.4)] backdrop-blur-xl">
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-20 h-20 rounded-2xl border border-amber-500/30 bg-black/50 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                            <UserCircle className="w-12 h-12 text-amber-400/90" strokeWidth={1.25} />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.45em] text-amber-500/80 mb-2">Member</p>
                        <h1 className="text-3xl font-brand text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100">
                            Profil Anda
                        </h1>
                    </div>

                    <dl className="space-y-6">
                        <div className="rounded-2xl border border-white/5 bg-black/35 px-5 py-4">
                            <dt className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-1">Username</dt>
                            <dd className="text-lg text-zinc-100 font-medium">{user.username ?? '—'}</dd>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-black/35 px-5 py-4">
                            <dt className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-1">Email</dt>
                            <dd className="text-lg text-zinc-100 font-medium break-all">{user.email ?? '—'}</dd>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-black/35 px-5 py-4">
                            <dt className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-1">Role</dt>
                            <dd>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-amber-500/40 text-amber-300 bg-amber-500/10">
                                    {roleLabel}
                                </span>
                                <span className="sr-only">{user.role}</span>
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-10 pt-8 border-t border-white/5">
                        <Link
                            to="/shop"
                            className="block text-center text-xs uppercase tracking-[0.35em] text-zinc-500 hover:text-amber-400/90 transition-colors"
                        >
                            ← Kembali ke Shop
                        </Link>
                    </div>
                </div>

                <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-zinc-900/90 via-[#0c0c0f] to-black p-8 shadow-[0_0_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-2xl font-brand text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100">
                            Riwayat Pesanan
                        </h2>
                        <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            {orders.length} order
                        </span>
                    </div>

                    {ordersLoading && <p className="text-sm text-zinc-400">Memuat riwayat pesanan...</p>}
                    {!ordersLoading && ordersError && (
                        <p className="text-sm text-rose-300 border border-rose-500/30 bg-rose-500/10 px-4 py-3 rounded-xl">
                            {ordersError}
                        </p>
                    )}

                    {!ordersLoading && !ordersError && orders.length === 0 && (
                        <p className="text-sm text-zinc-500">Belum ada pesanan.</p>
                    )}

                    {!ordersLoading && !ordersError && orders.length > 0 && (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <article
                                    key={order.id}
                                    className="rounded-2xl border border-white/5 bg-black/35 px-5 py-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                                            {new Date(order.createdAt).toLocaleString('id-ID')}
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase border ${
                                                order.status === 'paid'
                                                    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                                                    : 'border-amber-400/40 bg-amber-500/15 text-amber-300'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    <ul className="mt-3 space-y-2 text-zinc-300 text-sm">
                                        {(order.itemsDetailed || []).map((item, idx) => (
                                            <li key={`${order.id}-${idx}`} className="rounded-xl border border-white/5 bg-zinc-900/40 px-3 py-2 text-zinc-200">
                                                {item.productName} <span className="text-zinc-500">x {item.quantity}</span>
                                            </li>
                                        ))}
                                        {!order.itemsDetailed?.length && <li className="text-zinc-500">-</li>}
                                    </ul>

                                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-xs text-zinc-500 break-all">{order.shipping_address || '-'}</p>
                                        <p className="text-sm font-semibold text-amber-200">
                                            Total: Rp {Number(order.amount).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Profile;
