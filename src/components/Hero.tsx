import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

export default function Hero() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-brand-surface">
      {/* Background with Professional Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1620808461872-9cc911043900?auto=format&fit=crop&q=85&w=2400" 
          alt="Luxury Eco Home" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-[1px] w-8 bg-white/40" />
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/80">Est. 2024 • Organic Conscious Shop</span>
            <span className="h-[1px] w-8 bg-white/40" />
          </div>

          <h1 className="text-4xl md:text-7xl font-light text-white tracking-tighter mb-8 leading-[0.9] serif italic">
             {t('heroTitlePart1')} <br />
             {t('heroTitlePart2')} <br />
             {t('heroTitlePart3')}
          </h1>
          
          <p className="text-sm md:text-base text-white/70 font-light mb-10 max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.1em]">
            {t('heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/shop" className="group relative px-12 py-5 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-accent hover:text-white transition-all duration-500 shadow-2xl overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                {t('shopNow')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/gallery" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-brand-accent transition-colors py-3 border-b border-white/20 hover:border-brand-accent">
              Explore Our Story
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
