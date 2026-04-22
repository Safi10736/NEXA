import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  ShieldAlert,
  CreditCard,
  DollarSign,
  Fingerprint,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  Package
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatPrice } from '../../lib/utils';
import { logAdminAction } from '../../lib/adminUtils';

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState('all');
  const [orderList, setOrderList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && !error) {
      setOrderList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('admin_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          [field]: value,
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);
      
      if (error) throw error;
      await logAdminAction('UPDATE_ORDER', orderId, { field, value });
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'Confirmed': return <CheckCircle2 className="w-3 h-3" />;
      case 'Shipped': return <Truck className="w-3 h-3" />;
      case 'Delivered': return <CheckCircle2 className="w-3 h-3" />;
      case 'Cancelled': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-blue-500/10 text-blue-500';
      case 'Confirmed': return 'bg-cyan-500/10 text-cyan-500';
      case 'Shipped': return 'bg-yellow-500/10 text-yellow-500';
      case 'Delivered': return 'bg-green-500/10 text-green-500';
      case 'Cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-neutral-500/10 text-neutral-500';
    }
  };

  const filteredOrders = orderList.filter(o => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return o.status === 'Pending';
    if (activeTab === 'shipped') return o.status === 'Shipped';
    if (activeTab === 'completed') return o.status === 'Delivered';
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2">Order <span className="serif italic text-brand-accent">Management</span></h1>
          <p className="text-xs text-neutral-500 lowercase tracking-wide">Track, verify and fulfill customer orders globally.</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-[#0a0a0a] border border-neutral-900 rounded-full">
           {['all', 'pending', 'shipped', 'completed'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all
                  ${activeTab === tab ? 'bg-brand-accent text-white shadow-lg' : 'text-neutral-500 hover:text-white'}
                `}
             >
                {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-900">
              <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Order ID</th>
              <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Customer</th>
              <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest text-center">Payment</th>
              <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Total</th>
              <th className="px-8 py-6 text-right serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/50">
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className={`group hover:bg-neutral-900/30 transition-colors ${expandedOrder === order.id ? 'bg-neutral-900/50' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-white uppercase">{order.id.substring(0, 8)}...</span>
                      {order.isFraudRisk && (
                        <div className="group/risk relative">
                          <ShieldAlert className="w-4 h-4 text-orange-500 animate-pulse cursor-help" />
                          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover/risk:block w-48 p-3 bg-neutral-900 border border-orange-500/20 rounded-xl z-50 shadow-2xl">
                             <p className="text-[8px] text-orange-500 font-bold uppercase mb-1">Fraud Warning</p>
                             <p className="text-[10px] text-neutral-400">High value order with unverified shipping address.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-[10px] text-white font-bold uppercase tracking-widest">{order.customer}</p>
                      <p className="text-[8px] text-neutral-500 uppercase">{order.date}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleUpdateStatus(order.id, 'payment_verified', !order.payment_verified)}
                        className={`
                          p-2 rounded-xl transition-all border
                          ${order.payment_verified ? 'bg-green-500 text-white border-green-400 shadow-lg shadow-green-500/20' : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-white'}
                        `}
                        title={order.payment_verified ? 'Payment Verified' : 'Click to Verify'}
                      >
                         {order.method === 'COD' ? <DollarSign className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                      </button>
                      <div className="text-left min-w-[60px]">
                        <p className={`text-[9px] font-bold uppercase leading-none ${order.payment_verified ? 'text-green-500' : 'text-neutral-500'}`}>
                          {order.payment_verified ? 'Verified' : (order.payment_status || 'Pending')}
                        </p>
                        <p className="text-[8px] text-neutral-600 uppercase tracking-tighter mt-1">{order.method}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, 'status', e.target.value)}
                      className={`
                         appearance-none inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-bold uppercase tracking-widest outline-none border border-neutral-800 cursor-pointer transition-all
                        ${getStatusColor(order.status)}
                      `}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 font-bold text-white text-[10px]">{formatPrice(order.total)}</td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className={`p-2 rounded-lg transition-all ${expandedOrder === order.id ? 'bg-brand-accent text-white rotate-180' : 'bg-neutral-900 text-neutral-500 hover:text-white'}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </td>
                </tr>

                {/* Expanded Details Row */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-neutral-900/20 border-b border-neutral-900/50"
                    >
                      <td colSpan={6} className="px-12 py-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                          {/* Items Column */}
                          <div>
                             <h4 className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
                               <Package className="w-3 h-3" /> Purchased Items
                             </h4>
                             <div className="space-y-4">
                                {order.items?.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                                     <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-white uppercase truncate">{item.name}</p>
                                        <p className="text-[9px] text-neutral-500 uppercase tracking-tighter">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                     </div>
                                     <div className="text-[10px] font-bold text-white ml-2">{formatPrice(item.price * item.quantity)}</div>
                                  </div>
                                ))}
                             </div>
                          </div>

                          {/* Shipping Details */}
                          <div>
                             <h4 className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
                               <MapPin className="w-3 h-3" /> Shipping Information
                             </h4>
                             <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 space-y-4">
                               <div className="flex items-start gap-3">
                                 <UserIcon className="w-3 h-3 text-brand-accent mt-1" />
                                 <p className="text-[10px] text-neutral-300 uppercase leading-snug">{order.customer}</p>
                               </div>
                               <div className="flex items-start gap-3">
                                 <Mail className="w-3 h-3 text-brand-accent mt-1" />
                                 <p className="text-[10px] text-neutral-300 uppercase leading-snug">{order.email}</p>
                               </div>
                               <div className="flex items-start gap-3">
                                 <Phone className="w-3 h-3 text-brand-accent mt-1" />
                                 <p className="text-[10px] text-neutral-300 uppercase leading-snug font-mono">{order.phone}</p>
                               </div>
                               <div className="flex items-start gap-3 border-t border-neutral-800 pt-4">
                                 <MapPin className="w-3 h-3 text-brand-accent mt-1" />
                                 <p className="text-[10px] text-neutral-400 uppercase leading-relaxed">
                                   {order.shipping_details?.address}<br/>
                                   {order.shipping_details?.city}, {order.shipping_details?.zip}
                                 </p>
                               </div>
                             </div>
                          </div>

                          {/* Payment Verification Info */}
                          <div>
                             <h4 className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
                               <ShieldAlert className="w-3 h-3" /> Payment Audit
                             </h4>
                             <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 space-y-4">
                               <div className="flex justify-between items-center mb-4">
                                  <span className="text-[9px] text-neutral-500 uppercase">Method</span>
                                  <span className="text-[9px] font-bold text-white uppercase">{order.method}</span>
                               </div>
                               {order.transaction_id && (
                                 <div className="p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
                                    <p className="text-[8px] text-brand-accent font-bold uppercase mb-2 flex items-center gap-1">
                                      <Fingerprint className="w-2.5 h-2.5" /> Transaction ID
                                    </p>
                                    <code className="text-[11px] text-brand-accent font-mono block tracking-wider">{order.transaction_id}</code>
                                 </div>
                               )}
                               <button 
                                 onClick={() => handleUpdateStatus(order.id, 'payment_verified', !order.payment_verified)}
                                 className={`w-full py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${order.payment_verified ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-brand-accent hover:text-white'}`}
                               >
                                 {order.payment_verified ? 'Payment Verified ✓' : 'Confirm Payment Received'}
                               </button>
                             </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
