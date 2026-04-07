import { useEffect, useState } from 'react';
import API from '../../api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaidTransactions = async () => {
            try {
                const res = await API.get('/admin/transactions-paid');
                setTransactions(res.data?.data || []);
            } finally {
                setLoading(false);
            }
        };

        fetchPaidTransactions();
    }, []);

    if (loading) return <p className="text-sm text-gray-500">Memuat transaksi...</p>;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">Transaksi PAID</h1>
            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-900 text-gray-100">
                        <tr>
                            <th className="p-3 text-left">External ID</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td className="p-4 text-gray-500" colSpan="4">Belum ada transaksi berstatus PAID.</td>
                            </tr>
                        ) : (
                            transactions.map((trx) => (
                                <tr key={trx.id} className="border-t hover:bg-amber-50/40">
                                    <td className="p-3">{trx.external_id}</td>
                                    <td className="p-3">Rp {Number(trx.amount).toLocaleString('id-ID')}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(trx.createdAt).toLocaleString('id-ID')}</td>
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
