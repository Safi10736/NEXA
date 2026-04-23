import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Bell,
  Search,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'Inventory', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();
  const { user } = useAuth();

  const handleLogout = () => {
    supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-brand-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-light text-white mb-4 italic serif">Access Restricted</h1>
            <p className="text-neutral-500 mb-8 lowercase tracking-wide max-w-sm mx-auto">
              This terminal is reserved for Nexa administrators. 
              Unauthorized access attempts are logged and restricted for security protocol integrity.
            </p>

            {user && (
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 mb-10 text-left shadow-2xl">
                <p className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Nexa Protocol: Role Setup
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex gap-4">
                    <span className="text-brand-accent font-serif italic text-lg">01.</span>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-relaxed">Access Supabase Dashboard and navigate to the <span className="text-white">"admins"</span> table.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-brand-accent font-serif italic text-lg">02.</span>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-relaxed">Add a new record with <span className="text-white">"active: true"</span> and use the Unique Identity below:</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 bg-black px-4 py-4 rounded-xl border border-white/5 shadow-inner">
                  <code className="text-[10px] text-brand-accent font-mono truncate flex-1 tracking-wider">{user.id}</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(user.id);
                      alert('Protocol Identity Copied');
                    }}
                    className="text-[9px] font-bold bg-neutral-800 text-neutral-300 px-4 py-2 rounded-lg hover:bg-neutral-700 hover:text-white transition-all uppercase tracking-widest"
                  >
                    Copy ID
                  </button>
                </div>
                <p className="text-[8px] text-neutral-600 mt-6 italic font-medium uppercase tracking-tighter text-center">Identity verified via NEXA Security Layer.</p>
              </div>
            )}

            <Link 
              to="/" 
              className="inline-block py-3 px-8 bg-white text-black rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-white transition-all shadow-xl"
            >
              Back to Shop
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#0a0a0a] border-r border-neutral-900 flex flex-col fixed inset-y-0 z-50 transition-all duration-300 overflow-hidden"
      >
        <div className="p-8 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-light tracking-tighter uppercase"
            >
              Nexa <span className="serif italic text-brand-accent">Admin</span>
            </motion.span>
          )}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl transition-all group
                  ${isActive ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'text-neutral-500 hover:bg-neutral-800 hover:text-white'}
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                {isSidebarOpen && (
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && (
              <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? 280 : 80 }}
      >
        {/* Header */}
        <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-900 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
               <input 
                  type="text" 
                  placeholder="Search products, orders, customers..." 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-2 pl-12 pr-4 text-xs focus:ring-1 focus:ring-brand-accent outline-none transition-all"
               />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-[#0a0a0a]" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-800">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Md Safi</p>
                <p className="text-[8px] text-neutral-500 uppercase tracking-widest">Senior Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/admin/100/100" 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
