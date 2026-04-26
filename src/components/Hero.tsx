import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

import { useAppearance } from '../AppearanceContext';

export default function Hero() {
  const { t, lang } = useLanguage();
  const { settings } = useAppearance();

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-brand-surface dark:bg-black">
      {/* Background with Professional Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10" />
        <img 
          src={settings.heroBannerUrl} 
          alt="Luxury Eco Home" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
          referrerPolicy="no-referrer"
        />
        {/* Animated Neon Bubbles for futuristic vibe */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto pt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/5 backdrop-blur-2xl p-10 md:p-20 rounded-[4rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-[1px] w-8 bg-white/40" />
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-brand-gold">The Future of Space</span>
            <span className="h-[1px] w-8 bg-white/40" />
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.05] uppercase serif italic">
             {t('heroTitlePart1')} <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-white">{t('heroTitlePart2')}</span> <br />
             {t('heroTitlePart3')}
          </h1>
          
          <p className="text-xs md:text-sm text-white/60 font-medium mb-12 max-w-xl mx-auto leading-relaxed uppercase tracking-[0.2em] italic">
            {t('heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/shop" className="group relative px-14 py-6 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-accent hover:text-white transition-all duration-700 shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden glow-hover dark:bg-brand-accent dark:text-white">
              <span className="relative z-10 flex items-center gap-3">
                {t('shopNow')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/gallery" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all py-3">
              <span className="w-10 h-px bg-white/20 transition-all group-hover:w-16 group-hover:bg-brand-gold" />
              Explore Our Story
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
