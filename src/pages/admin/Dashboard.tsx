import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Package,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatPrice } from '../../lib/utils';

const data = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 19 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 2390, orders: 21 },
  { name: 'Sun', sales: 3490, orders: 28 },
];

const StatCard = ({ title, value, change, icon: Icon, isPositive }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0a0a0a] border border-neutral-900 p-6 rounded-3xl"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-neutral-900 rounded-2xl">
        <Icon className="w-5 h-5 text-brand-accent" />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">{title}</p>
    <h3 className="text-2xl font-light tracking-tighter text-white">{value}</h3>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    lowStock: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    // 1. Products Low Stock
    const { data: prods } = await supabase.from('products').select('stock');
    const lowStock = prods?.filter(p => (p.stock || 0) < 10).length || 0;

    // 2. Orders & Revenue
    const { data: orders } = await supabase.from('orders').select('total, payment_verified');
    let revenue = 0;
    orders?.forEach(o => {
      if (o.payment_verified) revenue += (o.total || 0);
    });

    // 3. Customers
    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

    // 4. Logs
    const { data: logs } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    setStats({
      revenue,
      orders: orders?.length || 0,
      customers: usersCount || 0,
      lowStock
    });
    if (logs) setRecentLogs(logs);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel('admin_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_logs' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tighter mb-2">Performance <span className="serif italic text-brand-accent">Overview</span></h1>
        <p className="text-xs text-neutral-500 lowercase tracking-wide">Monitoring real-time revenue and operational metrics for Nexa.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Total Revenue" 
          value={formatPrice(stats.revenue)} 
          change={12.5} 
          icon={DollarSign} 
          isPositive={true} 
        />
        <StatCard 
          title="Active Orders" 
          value={stats.orders.toString()} 
          change={8.2} 
          icon={ShoppingBag} 
          isPositive={true} 
        />
        <StatCard 
          title="Total Customers" 
          value={stats.customers.toLocaleString()} 
          change={3.1} 
          icon={Users} 
          isPositive={true} 
        />
        <div className="relative group">
           <StatCard 
            title="Low Stock Items" 
            value={stats.lowStock.toString()} 
            change={2.4} 
            icon={Package} 
            isPositive={stats.lowStock === 0} 
          />
          {stats.lowStock > 0 && (
            <motion.div 
               initial={{ scale: 0.8 }}
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold px-2 py-1 rounded-full shadow-lg shadow-red-500/20 flex items-center gap-1"
            >
               <AlertCircle className="w-2 h-2" />
               ACTION REQUIRED
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">Revenue Stream</h3>
                <p className="text-xs text-neutral-500">Weekly performance analytics</p>
             </div>
             <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Week</button>
                <button className="px-4 py-1.5 bg-neutral-900 text-neutral-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Month</button>
             </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1b4d3e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1b4d3e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#404040" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#404040" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#1b4d3e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admin Logs / Security Audit */}
        <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-8">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-900">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">Security Audit</h3>
              <ShieldCheck className="w-4 h-4 text-brand-accent/50" />
           </div>
           <div className="space-y-6">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex gap-4 group">
                   <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center text-neutral-500 group-hover:text-brand-accent transition-colors border border-neutral-800">
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                         <h4 className="text-[10px] font-bold text-white uppercase truncate">{log.admin_email?.split('@')[0]}</h4>
                         <span className="text-[7px] text-neutral-600 font-bold uppercase whitespace-nowrap ml-2">
                            {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'just now'}
                         </span>
                      </div>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-tighter line-clamp-1">
                         {log.action?.replace('_', ' ')} · {log.target_id?.substring(0, 8)}
                      </p>
                   </div>
                </div>
              ))}
              {recentLogs.length === 0 && (
                <div className="py-12 text-center">
                   <p className="text-[10px] text-neutral-600 uppercase tracking-widest">No recent admin activity</p>
                </div>
              )}
           </div>
           <button className="w-full mt-10 py-4 bg-neutral-900 text-neutral-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 hover:text-white transition-all border border-neutral-800">Review Full Audit Log</button>
        </div>
      </div>
    </AdminLayout>
  );
}
