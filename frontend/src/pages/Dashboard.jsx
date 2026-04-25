import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, AlertTriangle, ShieldAlert, PackageCheck, Zap } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function Dashboard({ user, setUser }) {
  const [data, setData] = useState({ totalStock: 0, lowStockItems: [], aiPredictions: [] });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/inventory/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = io('http://localhost:5000');
    socket.on('inventoryUpdated', () => {
      fetchData(); // refresh live
    });
    return () => socket.disconnect();
  }, []);

  // Demo chart data (if none exists from DB, use demo shape)
  const chartData = [
    { name: 'Mon', stock: 400 },
    { name: 'Tue', stock: 300 },
    { name: 'Wed', stock: 550 },
    { name: 'Thu', stock: 480 },
    { name: 'Fri', stock: 600 },
    { name: 'Sat', stock: 580 },
    { name: 'Sun', stock: 750 },
  ];

  return (
    <DashboardLayout user={user} setUser={setUser}>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Real-time inventory insights and AI predictions.</p>
        </div>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 font-medium text-sm rounded-full">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live Sync Active
          </span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Inventory" value={data.totalStock} icon={<PackageCheck />} color="indigo" />
        <KPICard title="Low Stock Alerts" value={data.lowStockItems.length} icon={<AlertTriangle />} color="rose" />
        <KPICard title="Pending Receipts" value="12" icon={<TrendingUp />} color="emerald" />
        <KPICard title="Suspicious Activity" value="0" icon={<ShieldAlert />} color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Inventory Trend (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="stock" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Zap size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="text-amber-400" />
              <h3 className="text-lg font-bold">AI Recommendations</h3>
            </div>
            
            {data.aiPredictions.length === 0 ? (
              <p className="text-indigo-200 text-sm">Gathering data for AI models...</p>
            ) : (
              <div className="space-y-4">
                {data.aiPredictions.map((pred, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{pred.name}</span>
                      <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded">Reorder Soon</span>
                    </div>
                    <p className="text-xs text-indigo-200 mb-1">Avg Daily Usage: {pred.avgDaily}</p>
                    <p className="text-sm font-medium">Auto-Suggest Order: {pred.recommendedOrder} units</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function KPICard({ title, value, icon, color }) {
  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-600',
    rose: 'bg-rose-100 text-rose-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
      <div className={`p-4 rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
