import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Mail, 
  MessageSquare, 
  History,
  Star,
  Search,
  Filter
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const customers = [
  { id: 'USR-001', name: 'Farhan Ahmed', email: 'farhan@example.com', orders: 12, spent: 4820, rating: 4.8 },
  { id: 'USR-002', name: 'Sarah Khan', email: 'sarah.k@example.com', orders: 5, spent: 1250, rating: 5.0 },
  { id: 'USR-003', name: 'Tanvir Hossain', email: 'tanvir@example.com', orders: 2, spent: 450, rating: 4.2 },
];

export default function AdminCustomers() {
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2">Customer <span className="serif italic text-brand-accent">Directory</span></h1>
          <p className="text-xs text-neutral-500 lowercase tracking-wide">Monitor user behavior, order history and handle inquiries.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-8 py-4 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-accent/20">
              <Mail className="w-4 h-4" />
              Broadcast Email
           </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] overflow-hidden">
         <table className="w-full">
            <thead>
               <tr className="border-b border-neutral-900">
                  <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Activity</th>
                  <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Avg. Rating</th>
                  <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Tot. Spent</th>
                  <th className="px-8 py-6 text-right serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/50">
               {customers.map((c) => (
                 <tr key={c.id} className="group hover:bg-neutral-900/30 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-xs font-bold text-brand-accent border border-neutral-800">
                             {c.name[0]}
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-white uppercase mb-0.5">{c.name}</p>
                             <p className="text-[8px] text-neutral-500 uppercase tracking-tighter">{c.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{c.orders} Orders</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-brand-gold fill-current" />
                          <span className="text-[10px] font-bold text-white">{c.rating}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-white text-[10px]">${c.spent.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white" title="View History"><History className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white" title="Message"><MessageSquare className="w-4 h-4" /></button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </AdminLayout>
  );
}
