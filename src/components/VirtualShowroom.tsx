import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Box, ArrowRight, Expand, Move } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { useLanguage } from '../LanguageContext';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function VirtualShowroom() {
  const { products } = useProducts();
  const { lang, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const featured = products.slice(0, 4);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative py-32 overflow-hidden bg-brand-bg dark:bg-black perspective-1000">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex items-end justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-accent/10 rounded-xl">
              <Box className="w-5 h-5 text-brand-accent animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent">Futuristic Exploration</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light serif italic text-neutral-900 dark:text-white leading-[1.1]">
            Virtual <br /> Showroom
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-4 text-neutral-400 dark:text-neutral-600">
          <Move className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest italic">Move mouse to explore space</span>
        </div>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center transition-all duration-700"
      >
        {/* The 3D Stage */}
        <motion.div 
          style={{ 
            rotateX, 
            rotateY,
            transformStyle: "preserve-3d"
          }}
          className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center"
        >
          {/* Background depth layers */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] h-[80%] border border-white/5 dark:border-white/5 rounded-[5rem] transform translate-z-[-200px]" />
            <div className="w-[100%] h-[100%] border border-white/10 dark:border-white/5 rounded-[8rem] transform translate-z-[-400px]" />
            <div className="absolute w-[500px] h-[500px] bg-brand-accent/10 blur-[150px] transform translate-z-[-600px]" />
          </div>

          {/* Floating Product Islands */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10 p-6">
            {featured.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                whileHover={{ translateZ: 50, scale: 1.05 }}
                className="group relative transform-gpu hover:z-20"
                style={{
                    transformStyle: "preserve-3d",
                    translateZ: idx % 2 === 0 ? 100 : 50,
                    marginTop: idx % 2 === 0 ? "80px" : "0px"
                }}
              >
                <Link to={`/product/${product.slug}`} className="block">
                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl bg-white dark:bg-neutral-900 border border-white/10 dark:border-white/5">
                        <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <h3 className="text-white text-lg font-light serif italic mb-1">{product.name}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-brand-gold font-bold text-sm">{formatPrice(product.price)}</span>
                                <div className="p-2 bg-white rounded-full text-black">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                
                {/* Floating Shadow Under Island */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 dark:bg-white/5 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                
                {/* Floating Tag */}
                <div className="absolute -top-4 -right-2 px-3 py-1 bg-brand-accent text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl transform translate-z-20">
                    Featured
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>

        {/* Ambient Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                 style={{ backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
      </div>
    </section>
  );
}
