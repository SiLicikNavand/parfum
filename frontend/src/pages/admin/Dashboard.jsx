import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Users, ShoppingCart, DollarSign, Activity, Clock } from 'lucide-react';

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
        { title: 'Total Inventory', value: stats?.products, icon: <Package size={24}/>, color: 'bg-blue-600', shadow: 'shadow-blue-200' },
        { title: 'Registered Users', value: stats?.customers, icon: <Users size={24}/>, color: 'bg-purple-600', shadow: 'shadow-purple-200' },
        { title: 'Monthly Orders', value: stats?.orders, icon: <ShoppingCart size={24}/>, color: 'bg-orange-500', shadow: 'shadow-orange-200' },
        { title: 'Gross Revenue', value: `Rp ${stats?.revenue.toLocaleString()}`, icon: <DollarSign size={24}/>, color: 'bg-emerald-500', shadow: 'shadow-emerald-200' },
    ];

    return (
        <div className="p-10 bg-[#fafafa] min-h-screen w-full">
            {/* WELCOME HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase">
                        System <span className="text-indigo-600">Overview</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.4em] mt-2">Real-time Performance Analytics</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Server Status: {stats?.serverStatus}</span>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                {cards.map((item, index) => (
                    <div key={index} className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-2xl shadow-gray-200/50 hover:scale-105 transition-transform duration-500 group">
                        <div className={`${item.color} ${item.shadow} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform`}>
                            {item.icon}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{item.title}</p>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{item.value}</h2>
                    </div>
                ))}
            </div>

            {/* SYSTEM LOGS SECTION */}
            <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="text-indigo-400" />
                            <h3 className="text-xl font-black uppercase italic">Operational Excellence</h3>
                        </div>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8">
                            Semua modul sistem (Auth, Inventory, & Payment) berjalan optimal. Database sinkronisasi terakhir dilakukan pada pukul <span className="text-indigo-400 font-bold">{stats?.lastUpdate}</span>.
                        </p>
                        <button className="bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-10 py-4 rounded-2xl font-black transition-all text-xs uppercase tracking-widest shadow-xl">
                            Generate Report
                        </button>
                    </div>
                    <div className="hidden lg:flex justify-end">
                        <Clock size={200} className="text-white/5 -mr-10" />
                    </div>
                </div>
                {/* Abstract Decor */}
                <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
};

export default Dashboard;