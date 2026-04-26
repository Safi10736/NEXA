import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Camera, Zap, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ARTeaser() {
  return (
    <section className="py-24 bg-white dark:bg-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-accent/10 rounded-full border border-brand-accent/20">
            <Zap className="w-4 h-4 text-brand-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent">NEXA Labs Core Feature</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-light text-neutral-900 dark:text-white leading-tight serif italic">
            Visualize Perfection <br /> 
            <span className="text-brand-accent">In Your Space</span>
          </h2>
          
          <p className="text-sm md:text-base text-neutral-500 font-light leading-relaxed max-w-lg">
            Our proprietary AR Try-On technology bridge the gap between digital selection and physical reality. Use your device camera to preview handcrafted masterpieces in real-scale within your own environment.
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="flex items-start gap-4">
               <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl">
                 <Box className="w-5 h-5 text-neutral-400" />
               </div>
               <div>
                  <h4 className="text-[10px] font-bold text-neutral-800 dark:text-white uppercase tracking-widest mb-1">True Scale</h4>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Precision AR Core Integration</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl">
                 <Camera className="w-5 h-5 text-neutral-400" />
               </div>
               <div>
                  <h4 className="text-[10px] font-bold text-neutral-800 dark:text-white uppercase tracking-widest mb-1">Instant View</h4>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest">No App Download Required</p>
               </div>
            </div>
          </div>
          
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-4 px-10 py-6 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-accent transition-all duration-500 shadow-xl group"
          >
            Explore AR Products
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold group-hover:scale-150 transition-transform" />
          </Link>
        </div>
        
        <div className="flex-1 relative">
           <div className="relative z-10 aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 rounded-[3rem] overflow-hidden border border-neutral-200 dark:border-white/5 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41fa33a8?auto=format&fit=crop&q=80&w=1200" 
                alt="AR Technology Preview" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Product Overlay Mockup */}
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none"
              >
                 <img 
                    src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800" 
                    alt="Floating Product"
                    className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute -top-4 -right-4 p-2 bg-brand-accent rounded-full text-white shadow-xl">
                    <Smartphone className="w-4 h-4" />
                 </div>
              </motion.div>
              
              {/* Pulse Indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/40 rounded-full animate-ping" />
           </div>
           
           {/* Decorative elements */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-[80px]" />
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-[80px]" />
        </div>
      </div>
    </section>
  );
}
