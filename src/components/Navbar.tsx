import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, Globe, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';

export default function Navbar() {
  const { user } = useAuth();
  const { setIsCartOpen, cartCount, isDraggingProduct } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkPage = location.pathname === '/';
  const showDarkNav = isScrolled || !isDarkPage;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between',
        showDarkNav ? 'bg-brand-bg/95 backdrop-blur-md border-b border-neutral-100 py-3' : 'bg-transparent'
      )}
    >
      <div className="flex items-center gap-8">
        <button
          onClick={() => setIsMenuOpen(true)}
          className={cn(
            "p-2 rounded-full transition-colors",
            showDarkNav ? "hover:bg-neutral-100 text-neutral-900" : "hover:bg-white/10 text-neutral-900"
          )}
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="group flex items-center gap-2">
          <span className={cn(
            'text-2xl font-bold tracking-[0.2em] uppercase transition-colors serif italic',
            showDarkNav ? 'text-brand-accent' : 'text-neutral-900'
          )}>
            Nexa
          </span>
          {!showDarkNav && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />}
        </Link>
      </div>

      <div className={cn(
        "hidden md:flex items-center gap-10 font-medium tracking-[0.15em] text-[10px] uppercase",
        showDarkNav ? "text-neutral-900/70" : "text-neutral-900/70"
      )}>
        {['Lighting', 'Decor', 'Kitchen', 'Essentials'].map((item) => (
          <Link
            key={item}
            to="/shop"
            className="hover:text-brand-accent transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setLang(l => l === 'EN' ? 'BN' : 'EN')}
          className={cn(
            "flex items-center gap-1.5 text-[10px] font-medium tracking-[.15em] border rounded-full px-3 py-1 transition-colors uppercase",
            showDarkNav ? "border-neutral-200 text-neutral-900 hover:border-brand-accent" : "border-neutral-200 text-neutral-900 hover:border-brand-accent"
          )}
        >
          <Globe className="w-3.5 h-3.5" />
          {lang}
        </button>
        
        <button className={cn("p-2 rounded-full transition-colors hidden sm:block", "hover:bg-neutral-100 text-neutral-900")}>
          <Search className="w-5 h-5" />
        </button>

        <Link to="/profile" className={cn("p-2 rounded-full transition-colors overflow-hidden", "hover:bg-neutral-100")}>
          {user?.photoURL ? (
            <img src={user.photoURL} className="w-5 h-5 rounded-full object-cover" alt="Profile" />
          ) : (
            <User className={cn("w-5 h-5", "text-neutral-900")} />
          )}
        </Link>

        <button 
          id="cart-icon"
          onClick={() => setIsCartOpen(true)}
          className={cn(
            "relative p-2 rounded-full transition-all duration-500",
            showDarkNav ? "hover:bg-neutral-100 text-neutral-900" : "hover:bg-neutral-100 text-neutral-900",
            isDraggingProduct && "scale-125 bg-brand-accent text-white shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          )}
        >
          <motion.div
            animate={isDraggingProduct ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.div>
          {cartCount > 0 && !isDraggingProduct && (
            <span className={cn(
              "absolute top-1 right-1 w-4 h-4 text-[9px] flex items-center justify-center rounded-full font-bold",
              showDarkNav ? "bg-neutral-900 text-white" : "bg-brand-accent text-white"
            )}>
              {cartCount}
            </span>
          )}
          {isDraggingProduct && (
             <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest text-brand-accent whitespace-nowrap animate-bounce">
               Drop Here
             </span>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-white z-[999] p-8 sm:p-12 flex flex-col justify-between h-screen w-screen overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-8">
              <span className="text-3xl font-bold tracking-tighter uppercase text-neutral-900 italic serif">
                Nexa
              </span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-8 h-8 text-neutral-900" />
              </button>
            </div>

            <div className="flex flex-col gap-8 text-5xl md:text-7xl font-light tracking-tighter text-neutral-900 mb-12">
              {['New Arrivals', 'Lighting', 'Decor', 'Kitchen', 'Essentials'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    to="/shop"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:translate-x-4 transition-transform duration-500 serif italic hover:text-brand-accent block"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-10 mt-auto">
              <div className="h-px bg-neutral-100 w-full" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Follow Our Journey</h4>
                  <div className="flex gap-4">
                    <a href="https://www.facebook.com/share/1CiNRxyy6M/" target="_blank" rel="noopener noreferrer" className="p-3 border border-neutral-100 rounded-full transition-all hover:bg-neutral-900 hover:text-white group hover:shadow-xl">
                      <Facebook className="w-5 h-5 text-neutral-900 group-hover:text-white" />
                    </a>
                    <a href="https://www.instagram.com/nexa_124?igsh=MXBoN2N3ZnJyenh1bw==" target="_blank" rel="noopener noreferrer" className="p-3 border border-neutral-100 rounded-full transition-all hover:bg-neutral-900 hover:text-white group hover:shadow-xl">
                      <Instagram className="w-5 h-5 text-neutral-900 group-hover:text-white" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 border border-neutral-100 rounded-full transition-all hover:bg-neutral-900 hover:text-white group hover:shadow-xl">
                      <Linkedin className="w-5 h-5 text-neutral-900 group-hover:text-white" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 border border-neutral-100 rounded-full transition-all hover:bg-neutral-900 hover:text-white group hover:shadow-xl">
                      <Youtube className="w-5 h-5 text-neutral-900 group-hover:text-white" />
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Language</h4>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <button 
                      onClick={() => setLang('EN')}
                      className={cn("transition-colors", lang === 'EN' ? "text-neutral-900 underline underline-offset-4" : "text-neutral-300")}
                    >
                      EN
                    </button>
                    <span className="text-neutral-100">|</span>
                    <button 
                       onClick={() => setLang('BN')}
                       className={cn("transition-colors", lang === 'BN' ? "text-neutral-900 underline underline-offset-4" : "text-neutral-300")}
                    >
                      BN
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] pb-4">
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-neutral-900 transition-colors">Contact</Link>
                <Link to="/support#shipping" onClick={() => setIsMenuOpen(false)} className="hover:text-neutral-900 transition-colors">Shipping</Link>
                <Link to="/support#returns" onClick={() => setIsMenuOpen(false)} className="hover:text-neutral-900 transition-colors">Returns</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
