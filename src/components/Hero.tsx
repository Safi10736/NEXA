import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

import { useAppearance } from '../AppearanceContext';

export default function Hero() {
  const { t, lang } = useLanguage();
  const { settings } = useAppearance();

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-brand-accent">
      {/* Background with Professional Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={settings.heroBannerUrl} 
          alt="Luxury Jewelry" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom brightness-[0.7]"
          referrerPolicy="no-referrer"
        />
        {/* Subtle Luxury Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
      </div>

      <div className="relative z-20 text-center px-6 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex items-center justify-center gap-6 mb-12"
          >
            <span className="h-px w-10 md:w-20 bg-brand-gold/40" />
            <span className="text-[11px] display tracking-[0.6em] text-brand-gold">{lang === 'BN' ? 'আভিজাত্যের প্রতীক' : 'The Epitome of Elegance'}</span>
            <span className="h-px w-10 md:w-20 bg-brand-gold/40" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="text-5xl sm:text-7xl md:text-[100px] lg:text-[120px] serif text-white tracking-tight mb-12 leading-[1.1] md:leading-[0.9] md:px-0"
          >
             {lang === 'BN' ? (
               <>অপূর্ব সুন্দর <br className="hidden md:block" /> <span className="italic text-brand-gold">গহনা</span> সংগ্রহ</>
             ) : (
               <>Exquisite <br className="hidden md:block" /> <span className="italic text-brand-gold">Gems & Jewelry</span></>
             )}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-sm md:text-base text-white/70 font-light mb-16 max-w-2xl mx-auto leading-loose tracking-wide"
          >
            {lang === 'BN' ? 'প্রতিটি পিস ভালোবাসার সাথে এবং নিঁখুতভাবে কারুশিল্পীদের দ্বারা তৈরি।' : 'Every piece is a masterpiece, handcrafted with passion and precision to celebrate your most precious moments.'}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-10"
          >
            <Link to="/shop" className="group relative px-12 py-5 bg-brand-gold text-white rounded-sm text-[11px] display tracking-[0.3em] overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95 luxury-shadow">
              <span className="relative z-10 flex items-center gap-4">
                {t('shopNow')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <Link to="/gallery" className="group flex items-center gap-4 text-[11px] display tracking-[0.2em] text-white/80 hover:text-white transition-all py-3 border-b border-white/0 hover:border-white/20">
              {lang === 'BN' ? 'গ্যালারি দেখুন' : 'Explore Collections'}
              <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] display tracking-[0.4em] text-white/30 uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-brand-gold to-transparent" />
      </motion.div>
    </section>
  );
}
