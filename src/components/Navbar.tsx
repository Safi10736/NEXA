import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, Globe, Instagram, Facebook, Twitter, Linkedin, Youtube, Heart, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { useLanguage } from '../LanguageContext';
import { useAppearance } from '../AppearanceContext';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const { user } = useAuth();
  const { setIsCartOpen, cartCount, isDraggingProduct } = useCart();
  const { wishlist } = useWishlist();
  const { lang, setLang, t } = useLanguage();
  const { settings, toggleTheme } = useAppearance();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkPage = location.pathname === '/';
  const isTransparent = !isScrolled && isDarkPage;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-6 flex items-center justify-between',
        !isTransparent
          ? 'bg-white/90 backdrop-blur-xl border-b border-neutral-100 py-4 shadow-sm' 
          : 'bg-transparent text-white'
      )}
    >
      <div className="flex items-center gap-12">
        <button
          onClick={() => setIsMenuOpen(true)}
          className={cn(
            "p-2 rounded-full transition-colors",
            isTransparent ? "hover:bg-white/10 text-white" : "hover:bg-neutral-100 text-brand-accent"
          )}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className={cn(
          "hidden lg:flex items-center gap-10 text-[10px] display tracking-[0.2em]",
          isTransparent ? "text-white/80" : "text-neutral-500"
        )}>
          {['Lighting', 'Decor', 'Kitchen', 'Essentials'].map((item) => (
            <Link
              key={item}
              to="/shop"
              className={cn(
                "hover:text-brand-gold transition-colors relative group py-2",
                !isTransparent && "hover:text-brand-accent"
              )}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-brand-gold transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>

      <Link to="/" className="absolute left-1/2 -translate-x-1/2 group">
        <span className={cn(
          'text-3xl font-normal tracking-[0.1em] transition-all duration-500 serif',
          isTransparent ? 'text-white' : 'text-brand-accent'
        )}>
          NEXA
        </span>
      </Link>

      <div className="flex items-center gap-2 md:gap-6">
        <button
          onClick={() => setLang(l => l === 'EN' ? 'BN' : 'EN')}
          className={cn(
            "hidden sm:flex items-center gap-2 text-[10px] display tracking-widest px-4 py-2 transition-all rounded-sm",
            isTransparent ? "text-white/80 border-white/20 hover:bg-white/10" : "text-neutral-500 border-neutral-100 hover:bg-neutral-50"
          )}
        >
          <Globe className="w-3 h-3" />
          {lang}
        </button>
        
        <div className="flex items-center gap-1 md:gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              "p-2 rounded-full transition-colors",
              isTransparent ? "text-white hover:bg-white/10" : "text-brand-accent hover:bg-neutral-100"
            )}
          >
            <Search className="w-5 h-5" />
          </button>

          <Link 
            to="/profile" 
            className={cn(
              "p-2 rounded-full transition-colors",
              isTransparent ? "text-white hover:bg-white/10" : "text-brand-accent hover:bg-neutral-100"
            )}
          >
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} className="w-5 h-5 rounded-full object-cover border border-brand-gold/30" alt="Profile" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </Link>

          <button 
            id="cart-icon"
            onClick={() => setIsCartOpen(true)}
            className={cn(
              "relative p-2 rounded-full transition-all duration-500",
              isTransparent ? "text-white hover:bg-white/10" : "text-brand-accent hover:bg-neutral-100",
              isDraggingProduct && "scale-110 bg-brand-gold text-white shadow-xl"
            )}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-gold text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-brand-accent/40 backdrop-blur-sm z-[99]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-screen md:w-[450px] bg-white z-[100] px-12 md:px-20 py-16 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-32">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-3xl serif text-brand-accent tracking-widest italic">NEXA</Link>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-neutral-50 rounded-full text-brand-accent hover:rotate-90 transition-all duration-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-12 mb-auto">
                {[
                  { label: lang === 'BN' ? 'কালেকশন' : 'Collections', to: '/shop' },
                  { label: lang === 'BN' ? 'গ্যালারি' : 'The Gallery', to: '/gallery' },
                  { label: lang === 'BN' ? 'আমাদের গল্প' : 'Heritage', to: '/about' },
                  { label: lang === 'BN' ? 'যোগাযোগ' : 'Concierge', to: '/contact' }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl md:text-5xl serif text-brand-accent hover:text-brand-gold transition-all flex items-center gap-6 group"
                    >
                      <span className="text-[10px] display opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">0{i+1}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-16 border-t border-neutral-100">
                <div className="flex items-center gap-10 mb-12">
                   {[Instagram, Facebook, Twitter].map((Icon, i) => (
                     <Icon key={i} className="w-5 h-5 text-neutral-400 hover:text-brand-gold cursor-pointer transition-colors" />
                   ))}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] display tracking-widest text-brand-accent">Nexa Atelier — Banani Crescent</p>
                  <p className="text-[9px] display tracking-widest text-neutral-400">Available Daily 10 AM — 8 PM</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
