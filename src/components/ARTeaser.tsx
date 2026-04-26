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
        
        <Link 
          to="/product/aurelia-table-lamp"
          className="flex-1 relative block group/ar cursor-pointer"
        >
           <div className="relative z-10 aspect-[4/5] bg-yellow-400 rounded-[3rem] overflow-hidden border border-neutral-200 dark:border-white/5 shadow-2xl transition-all duration-700 group-hover/ar:scale-[1.02] group-hover/ar:shadow-brand-accent/20">
              <img 
                src="https://images.unsplash.com/photo-1520923642038-b4259ace9439?auto=format&fit=crop&q=80&w=1200" 
                alt="AR Technology Preview" 
                className="w-full h-full object-cover opacity-80 group-hover/ar:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/ar:opacity-40 transition-opacity" />
              
              {/* Product Overlay Mockup */}
              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none"
              >
                 <div className="w-full h-full bg-yellow-200/40 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-2xl transform rotate-3 flex items-center justify-center">
                    <img 
                        src="https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800" 
                        alt="Floating Product"
                        className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] filter brightness-110"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute -top-4 -right-4 p-4 bg-brand-accent rounded-full text-white shadow-2xl animate-pulse">
                        <Smartphone className="w-6 h-6" />
                    </div>
                 </div>
              </motion.div>
              
              {/* View Indicator */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full px-10">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transform transition-all duration-500 group-hover/ar:scale-110 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">Click to Preview in AR</p>
                </div>
              </div>

              {/* Pulse Indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-brand-accent/30 rounded-full animate-ping pointer-events-none" />
           </div>
           
           {/* Decorative elements */}
           <div className="absolute -top-10 -right-10 w-60 h-60 bg-brand-accent/5 rounded-full blur-[100px] animate-pulse" />
           <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-gold/5 rounded-full blur-[100px] animate-pulse" />
        </Link>
      </div>
    </section>
  );
}
