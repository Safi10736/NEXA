import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

export default function Hero() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative h-[85vh] md:h-[80vh] bg-neutral-100 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1591147139223-846f3ae479a0?auto=format&fit=crop&q=80&w=2400"
          alt="Eco Kitchen" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center pt-20">
        <div className="w-full grid lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <div className="flex gap-4 mb-6">
               <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest text-white/90 hover:text-white transition-colors">{t('shop')}</Link>
               <button onClick={() => document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-bold uppercase tracking-widest text-white/90 hover:text-white transition-colors">{t('bestsellers')}</button>
               <Link to="/gallery" className="text-[10px] font-bold uppercase tracking-widest text-white/90 hover:text-white transition-colors">{t('gallery')}</Link>
               <Link to="/about" className="text-[10px] font-bold uppercase tracking-widest text-white/90 hover:text-white transition-colors">{t('about')}</Link>
            </div>

            <h1 className="text-4xl md:text-6xl font-light text-white leading-[1.1] mb-6 tracking-tight">
              {t('heroTitlePart1')} <br />
              <span className="serif italic">{t('heroTitlePart2')}</span> {lang === 'BN' ? '' : 'for'} <br />
              {t('heroTitlePart3')}
            </h1>
            
            <p className="text-white/80 text-xs md:text-sm font-light mb-8 max-w-md leading-relaxed">
              {t('heroDesc')}
            </p>
            
            <Link 
              to="/shop"
              className="group px-8 py-3 bg-white text-neutral-900 rounded-full flex items-center gap-3 hover:bg-brand-accent hover:text-white transition-all duration-500 font-bold uppercase text-[9px] tracking-widest shadow-xl"
            >
              {t('shopNow')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="hidden lg:flex justify-end items-end pb-12">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-white w-48 shadow-2xl"
             >
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                      <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">{t('naturalSustainable')}</span>
                   </div>
                   <p className="text-[7px] font-bold uppercase tracking-widest mb-4">{t('ecoConscious')}</p>
                   <span className="text-5xl font-light tracking-tighter serif italic">96%</span>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
