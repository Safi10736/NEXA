import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, Truck, CheckCircle2, MapPin, Box, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';

const STEPS = [
  { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2, description: 'Your masterpiece is being prepared.' },
  { id: 'processing', label: 'Artisan Crafting', icon: Box, description: 'Hand-finishing and quality inspection.' },
  { id: 'shipped', label: 'In Transit', icon: Truck, description: 'Luxury white-glove delivery in progress.' },
  { id: 'delivered', label: 'Delivered', icon: Package, description: 'The artifact has reached its destination.' }
];

export default function OrderTracker() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    setIsSearching(true);
    // Mocking a search
    setTimeout(() => {
      setFoundOrder({
        id: orderId,
        status: 'In Transit',
        progress: 65,
        currentStep: 2,
        estimatedDelivery: 'Tomorrow, by 6:00 PM',
        items: [
          { name: 'Aurelia Minimalist Table Lamp', price: 450 }
        ],
        location: 'Gulshan, Dhaka'
      });
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-4 block">Futuristic Tracking</span>
          <h1 className="text-5xl font-light text-neutral-900 tracking-tighter serif italic mb-6">Track Your <span className="text-brand-accent underline underline-offset-8">Artifact</span></h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            Enter your order reference ID below to visualize the real-time progress of your premium delivery.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-24">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="ENTER ORDER ID (E.G. NEXA-9921)..." 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            className="w-full bg-white border border-neutral-100 rounded-full py-6 pl-16 pr-40 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none shadow-xl shadow-brand-accent/5"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-4 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center gap-2 group"
          >
            {isSearching ? 'Scanning Network...' : 'Track Now'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <AnimatePresence mode="wait">
          {foundOrder ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Status Header */}
              <div className="bg-white border border-neutral-100 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                
                <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-brand-accent">Status: {foundOrder.status}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">ID: {foundOrder.id}</span>
                    </div>
                    <h2 className="text-4xl font-light text-neutral-900 tracking-tighter serif italic mb-4">Estimated Delivery</h2>
                    <p className="text-2xl font-light text-brand-accent tracking-tight mb-8">{foundOrder.estimatedDelivery}</p>
                    
                    <div className="flex items-center gap-4 text-neutral-500">
                      <MapPin className="w-4 h-4 text-brand-accent" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Current Location: {foundOrder.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end justify-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                         <circle
                           cx="64"
                           cy="64"
                           r="58"
                           stroke="currentColor"
                           strokeWidth="4"
                           fill="transparent"
                           className="text-neutral-50"
                         />
                         <motion.circle
                           cx="64"
                           cy="64"
                           r="58"
                           stroke="currentColor"
                           strokeWidth="4"
                           fill="transparent"
                           strokeDasharray={364}
                           initial={{ strokeDashoffset: 364 }}
                           animate={{ strokeDashoffset: 364 - (364 * foundOrder.progress) / 100 }}
                           transition={{ duration: 2, ease: "easeOut" }}
                           className="text-brand-accent"
                         />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-light text-neutral-900">{foundOrder.progress}%</span>
                          <span className="text-[6px] font-bold uppercase tracking-widest text-neutral-400">Voyage</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps Visualizer */}
              <div className="relative pt-12 pb-12">
                <div className="absolute top-[68px] left-[5%] right-[5%] h-px bg-neutral-100" />
                <div 
                  className="absolute top-[68px] left-[5%] h-0.5 bg-brand-accent transition-all duration-1000" 
                  style={{ width: `${(foundOrder.currentStep / (STEPS.length - 1)) * 90}%` }}
                />

                <div className="grid grid-cols-4 gap-4 relative z-10">
                  {STEPS.map((step, idx) => {
                    const isActive = idx <= foundOrder.currentStep;
                    const isCurrent = idx === foundOrder.currentStep;
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="flex flex-col items-center text-center">
                        <motion.div 
                          initial={false}
                          animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                          className={cn(
                            "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 mb-6",
                            isActive ? "bg-white border-brand-accent text-brand-accent shadow-[0_0_20px_rgba(212,175,55,0.3)] shadow" : "bg-neutral-50 border-neutral-100 text-neutral-300"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />
                        </motion.div>
                        <h4 className={cn("text-[9px] font-bold uppercase tracking-widest mb-2 transition-colors", isActive ? "text-neutral-900" : "text-neutral-300")}>
                          {step.label}
                        </h4>
                        <p className={cn("text-[7px] font-medium uppercase tracking-tighter max-w-[80px]", isActive ? "text-neutral-400" : "text-neutral-200")}>
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Artifact Protection Card */}
              <div className="bg-neutral-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-white/5">
                 <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <ShieldCheck className="w-8 h-8" />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-light text-white serif italic mb-1">Authenticated Artifact Protection</h3>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Every order is secured with Nexa's white-glove artisan insurance policy.</p>
                 </div>
                 <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all">
                    View Policy
                 </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border-2 border-dashed border-neutral-100 rounded-[3rem]"
            >
               <Package className="w-12 h-12 text-neutral-100 mx-auto mb-6" />
               <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">Awaiting your identification code...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
