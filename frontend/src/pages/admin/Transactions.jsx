import { useEffect, useState } from 'react';
import API from '../../api';
import { Trash2 } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllTransactions = async () => {
        try {
            const res = await API.get('/payment/admin/transactions');
            setTransactions(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data transaksi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    const handleDeleteTransaction = async (id) => {
        const ok = window.confirm('Yakin ingin menghapus transaksi ini?');
        if (!ok) return;

        try {
            await API.delete(`/payment/admin/transactions/${id}`);
            setTransactions((prev) => prev.filter((trx) => trx.id !== id));
        } catch (err) {
            window.alert(err.response?.data?.message || 'Gagal menghapus transaksi.');
        }
    };

    const handleDeleteAllTransactions = async () => {
        const ok = window.confirm('Yakin ingin menghapus semua riwayat transaksi?');
        if (!ok) return;

        try {
            await API.delete('/payment/admin/transactions');
            setTransactions([]);
        } catch (err) {
            window.alert(err.response?.data?.message || 'Gagal menghapus semua transaksi.');
        }
    };

    const getStatusBadge = (status) => {
        const normalized = String(status || '').toLowerCase();
        if (normalized === 'paid') {
            return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40';
        }
        if (normalized === 'pending') {
            return 'bg-amber-500/15 text-amber-300 border-amber-400/40';
        }
        return 'bg-rose-500/15 text-rose-300 border-rose-400/40';
    };

    if (loading) return <p className="text-sm text-zinc-400">Memuat transaksi...</p>;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-brand text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100">
                    Data Transaksi Customer
                </h1>
                <button
                    type="button"
                    onClick={handleDeleteAllTransactions}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/15 transition-colors text-sm font-semibold"
                >
                    <Trash2 size={16} />
                    Hapus Semua Riwayat
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-amber-500/20 bg-gradient-to-b from-zinc-900/95 via-[#0a0a0c] to-black shadow-[0_0_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <table className="w-full text-sm text-zinc-200">
                    <thead className="bg-white/[0.03] text-zinc-300 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-left">Alamat Pengiriman</th>
                            <th className="p-4 text-left">Produk</th>
                            <th className="p-4 text-left">Total</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td className="p-5 text-zinc-500" colSpan="6">Belum ada transaksi.</td>
                            </tr>
                        ) : (
                            transactions.map((trx) => (
                                <tr key={trx.id} className="border-t border-white/5 hover:bg-white/[0.02] align-top">
                                    <td className="p-4">
                                        <p className="font-semibold text-amber-100">{trx.user?.username || 'Guest'}</p>
                                        <p className="text-xs text-zinc-500 break-all">{trx.user?.email || '-'}</p>
                                        <p className="text-[11px] text-zinc-500 mt-1">
                                            {new Date(trx.createdAt).toLocaleString('id-ID')}
                                        </p>
                                    </td>
                                    <td className="p-4 text-zinc-300 whitespace-pre-wrap">{trx.shipping_address || '-'}</td>
                                    <td className="p-4">
                                        <ul className="space-y-2">
                                            {(trx.itemsDetailed || []).map((item, idx) => (
                                                <li key={`${trx.id}-${idx}`} className="rounded-xl border border-white/5 bg-zinc-900/40 px-3 py-2 text-zinc-200">
                                                    {item.productName} <span className="text-zinc-500">x {item.quantity}</span>
                                                </li>
                                            ))}
                                            {!trx.itemsDetailed?.length && <li className="text-zinc-500">-</li>}
                                        </ul>
                                    </td>
                                    <td className="p-4 font-semibold text-amber-200">
                                        Rp {Number(trx.amount).toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusBadge(trx.status)}`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTransaction(trx.id)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors text-xs font-semibold"
                                            title="Hapus transaksi"
                                        >
                                            <Trash2 size={14} />
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
