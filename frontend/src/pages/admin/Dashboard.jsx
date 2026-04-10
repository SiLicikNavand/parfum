import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/dashboard');
                setStats(res.data.data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
        </div>
    );

    const cards = [
        { title: 'Total Inventory', value: stats?.products ?? 0, icon: <Package size={24}/>, color: 'bg-blue-600' },
        { title: 'Registered Users', value: stats?.customers ?? 0, icon: <Users size={24}/>, color: 'bg-purple-600' },
        { title: 'Monthly Orders', value: stats?.orders ?? 0, icon: <ShoppingCart size={24}/>, color: 'bg-orange-500' },
        { title: 'Gross Revenue', value: `Rp ${Number(stats?.revenue || 0).toLocaleString('id-ID')}`, icon: <DollarSign size={24}/>, color: 'bg-emerald-500' },
    ];

    return (
        <div className="p-10 bg-gray-50 min-h-screen w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Welcome, Admin!</h1>
                    <p className="text-gray-500 mt-2">Pantau statistik sistem secara real-time.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-600">Server Status: {stats?.serverStatus || 'Active'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                            {item.icon}
                        </div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{item.title}</p>
                        <h2 className="text-2xl font-bold text-gray-900">{item.value}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;