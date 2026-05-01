import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { REVIEWS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductPage from './components/ProductPage';
import CartSidebar from './components/CartSidebar';
import AuthPage from './components/AuthPage';
import CheckoutPage from './components/CheckoutPage';
import SuccessPage from './components/SuccessPage';
import OrderTracker from './components/OrderTracker';
import ShopPage from './components/ShopPage';
import GalleryPage from './components/GalleryPage';
import AboutPage from './components/AboutPage';
import SupportPage from './components/SupportPage';
import ContactPage from './components/ContactPage';
import ChatWidget from './components/ChatWidget';
import AdminDashboard from './pages/admin/Dashboard';
import AdminInventory from './pages/admin/Inventory';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import AdminGallery from './pages/admin/Gallery';
import { Star, MessageCircle, Instagram, Twitter, Facebook, ArrowRight, User as UserIcon, ShieldCheck, BarChart3, Linkedin, Youtube, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';

import { Product } from './types';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from './lib/supabase';
import { CartProvider, useCart } from './CartContext';
import { ProductProvider, useProducts } from './ProductContext';
import { WishlistProvider } from './WishlistContext';
import FlyToCartRenderer from './components/FlyToCart';
import { useAdmin } from './hooks/useAdmin';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { AppearanceProvider } from './AppearanceContext';
import { NotificationProvider } from './NotificationContext';
import FlashSaleBanner from './components/FlashSaleBanner';
import PriceDropMonitor from './components/PriceDropMonitor';
import VirtualShowroom from './components/VirtualShowroom';
import ARTeaser from './components/ARTeaser';
import WhatsAppButton from './components/WhatsAppButton';
import PWAPrompt from './components/PWAPrompt';

function FeaturedCollections() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('featured_collections')
        .select('*')
        .order('slot_index', { ascending: true });
      
      if (data && data.length > 0) {
        setItems(data);
      } else {
        setItems([
          { title: 'Fine Jewelry', image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce338?auto=format&fit=crop&q=80&w=800' },
          { title: 'Elegant Timepieces', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
          { title: 'Luxury Accessories', image_url: 'https://images.unsplash.com/photo-1544787210-22c66d137f6d?auto=format&fit=crop&q=80&w=800' },
          { title: 'Heritage Collection', image_url: 'https://images.unsplash.com/photo-1610631880197-484c399c922c?auto=format&fit=crop&q=80&w=800' },
        ]);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-12 -mt-20 md:-mt-32 mb-40 relative z-30">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 1 }}
          className="relative h-[450px] md:h-[550px] rounded-sm overflow-hidden group shadow-2xl border border-white/5"
        >
          <img src={item.image_url} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-x-8 bottom-12">
            <span className="text-[9px] display tracking-[0.4em] text-[#d4af37] mb-4 block uppercase font-light">Collection</span>
            <h4 className="text-white text-3xl md:text-4xl serif italic mb-8 tracking-tighter leading-tight group-hover:translate-x-2 transition-transform duration-700">{item.title}</h4>
            <Link 
              to="/shop" 
              className="group/link flex items-center gap-4 text-white hover:text-brand-gold text-[10px] display tracking-[0.3em] transition-all uppercase"
            >
              The Curated List
              <div className="h-px w-8 bg-brand-gold/40 group-hover/link:w-12 transition-all duration-500" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BestsellingSection() {
  const { products } = useProducts();
  const { t, lang } = useLanguage();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <section id="bestsellers" className="py-32 px-6 bg-brand-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 text-center md:text-left gap-8">
          <div>
            <span className="text-[11px] display tracking-[0.4em] text-brand-gold mb-6 block">Exquisite Selection</span>
            <h2 className="text-5xl md:text-7xl serif text-brand-accent leading-none">
               {lang === 'BN' ? (
                 <>সেরা <span className="italic">কালেকশন</span></>
               ) : (
                 <>Featured <span className="italic">Collection</span></>
               )}
            </h2>
          </div>
          <Link to="/shop" className="flex items-center gap-4 text-[11px] display text-brand-accent group pb-2 border-b border-brand-gold/20 hover:border-brand-gold transition-all">
            {lang === 'BN' ? 'সব দেখুন' : 'Explore All'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16">
          {products.slice(0, 8).map((p) => (
             <ProductCard key={p.id} product={p} onQuickView={handleQuickView} />
          ))}
        </div>
      </div>

      <QuickViewModal 
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </section>
  );
}

function SecondaryTeasers() {
  const { t, lang } = useLanguage();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery')
        .select('image_url')
        .eq('is_highlighted', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (data && data.length > 0) {
        setGalleryImages(data.map(item => item.image_url));
      } else {
        // Fallback defaults for premium look
        setGalleryImages([
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1544787210-22c66d137f6d?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1613539824653-33924f0c4068?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
        ]);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section className="py-24 px-6 bg-brand-surface border-y border-neutral-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24">
        {/* Gallery Grid */}
        <Link to="/gallery" className="block group">
           <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-muted mb-8 block group-hover:text-brand-accent transition-colors">Inspiration & Gallery</span>
           <div className="grid grid-cols-3 gap-3">
              {galleryImages.map((img, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0 }} 
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer bg-neutral-100 shadow-sm group-hover:shadow-xl transition-all"
                >
                  <img 
                    src={img} 
                    referrerPolicy="no-referrer" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop'; }}
                  />
                </motion.div>
              ))}
           </div>
        </Link>

        {/* Brand Commitment Teaser */}
        <div className="flex flex-col justify-center">
           <span className="text-[10px] display tracking-[0.5em] text-[#d4af37] mb-8 block uppercase">Our Heritage</span>
           <h3 className="text-5xl md:text-6xl serif italic text-brand-accent tracking-tighter mb-8 leading-[1.1]">
             {lang === 'BN' ? 'আভিজাত্য এবং স্থায়িত্বের এক অনন্য সংমিশ্রণ' : 'Crafting A Greener Narrative Of Prestige'}
           </h3>
           <p className="text-base text-neutral-500 font-light leading-relaxed mb-12 max-w-md serif italic">
             {lang === 'BN' ? 'টেকসই উপকরণ এবং নৈতিক আভিজাত্যের প্রতি আমাদের প্রতিশ্রুতি আবিষ্কার করুন।' : 'Discover our unwavering commitment to sustainable materials and ethical artisan partnerships — crafted for those who value the legacy of true luxury.'}
           </p>
           <div className="flex gap-4">
              <Link 
                to="/about"
                className="group relative px-12 py-5 bg-brand-accent text-white rounded-sm text-[9px] display tracking-[0.3em] overflow-hidden"
              >
                <div className="absolute inset-0 bg-brand-gold translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">{lang === 'BN' ? 'আমাদের গল্প' : 'THE LEGACY'}</span>
              </Link>
           </div>
        </div>
      </div>
    </section>
  );
}

function EnhancedReviewSection() {
  const { lang, t } = useLanguage();
  
  const reviews = [
    {
      name: "Sophia L.",
      title: "Design Critic",
      content: lang === 'BN' ? "চমৎকার ডিজাইন এবং কোয়ালিটি। প্রতিটি পণ্য একটি শিল্পের মতো সুন্দর।" : "Beyond excellence. Each piece feels like a bespoke artifact curated specifically for my lifestyle.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
    },
    {
      name: "Marcus Aurelius",
      title: "Artisan Collector",
      content: lang === 'BN' ? "সাধারণ জিনিসের মধ্যে অসাধারণ কিছু খুঁজে পেয়েছি। নেক্সা সত্যিই অনন্য।" : "The architectural integrity of their designs is unparalleled. A masterclass in luxury minimalism.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    }
  ];

  return (
    <section className="py-40 px-6 bg-[#080808] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-bg to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-24 items-start">
          {/* Rating Header */}
          <div className="lg:w-2/5">
            <span className="text-brand-gold text-[10px] display tracking-[0.6em] mb-8 block uppercase">The Member Narrative</span>
            <h2 className="text-6xl md:text-8xl serif italic mb-10 leading-[0.9] tracking-tighter">Voices Of <br/> Prestige</h2>
            
            <div className="flex items-center gap-8 mb-12">
               <div className="text-6xl serif text-brand-gold italic">4.9</div>
               <div className="h-16 w-px bg-white/10" />
               <div className="space-y-3">
                  <div className="flex text-brand-gold gap-1.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-[10px] display text-white/40 tracking-[0.3em] uppercase">Validated Global Score</p>
               </div>
            </div>
            
            <p className="text-neutral-400 text-lg serif italic font-light leading-relaxed max-w-sm mb-12">
              "To be a Nexa member is to appreciate the nuance of fine craftsmanship and the silence of true luxury."
            </p>

            <Link to="/gallery" className="group inline-flex items-center gap-4 text-[10px] display tracking-[0.4em] text-white/60 hover:text-brand-gold transition-all uppercase">
               Explore Gallery <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-3" />
            </Link>
          </div>

          {/* Testimonial Cards */}
          <div className="lg:w-3/5 grid gap-8">
            {reviews.map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-[#121212] border border-white/5 rounded-sm hover:border-brand-gold/30 transition-all duration-700 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/2 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                   <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={review.image} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <div className="flex gap-1.5 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                         {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-brand-gold text-brand-gold" />)}
                      </div>
                      <p className="text-lg md:text-xl serif italic text-white/90 leading-relaxed mb-6 group-hover:text-white transition-colors">
                        "{review.content}"
                      </p>
                      <div className="flex flex-col">
                        <span className="text-[11px] display tracking-widest text-[#d4af37] uppercase">{review.name}</span>
                        <span className="text-[9px] display tracking-[0.2em] text-white/30 uppercase mt-1">{review.title}</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t, lang } = useLanguage();

  const sections = [
    {
      id: 'help',
      title: 'Customer Care',
      links: [
        { label: 'Shipping & Delivery', to: '/support#shipping' },
        { label: 'Returns & Exchanges', to: '/support#returns' },
        { label: 'Privacy Policy', to: '/support#privacy' },
        { label: 'Terms of Service', to: '/support#terms' }
      ]
    },
    {
      id: 'about',
      title: 'Our World',
      links: [
        { label: 'About Nexa', to: '/about' },
        { label: 'Our Heritage', to: '/about' },
        { label: 'Artisan Process', to: '/about' },
        { label: 'Sustainability', to: '#' }
      ]
    },
    {
      id: 'services',
      title: 'Services',
      links: [
        { label: 'Book an Appointment', to: '/contact' },
        { label: 'Bespoke Jewelry', to: '/contact' },
        { label: 'Care & Repairs', to: '/contact' },
        { label: 'Store Locator', to: '#' }
      ]
    },
    {
      id: 'contact',
      title: 'The Atelier',
      content: (
        <div className="text-[11px] display text-white/50 tracking-wide leading-[2] text-left">
          <p className="text-[#d4af37] serif italic text-base mb-6">Dhaka Headquarters</p>
          <p>Level 5, Banani Crescent</p>
          <p>Gulshan 2, Dhaka 1212</p>
          <p className="mt-8 text-white/30">T: +880 1234 567 890</p>
          <p className="text-white/30">E: concierge@nexastore.com</p>
        </div>
      )
    }
  ];

  return (
    <footer className="bg-[#0a0a0a] pt-40 pb-20 px-6 border-t border-white/5 overflow-hidden text-white mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-12 mb-32">
          {/* Logo & Intro */}
          <div className="lg:col-span-4 max-w-sm">
            <Link to="/" className="text-4xl md:text-5xl serif text-white tracking-widest mb-10 block italic">NEXA</Link>
            <p className="text-white/40 text-base font-light leading-relaxed mb-12 italic serif">
              "We believe true luxury is silent. It is the harmony between artisan heritage and the modern pursuit of perfection."
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer">
                <span className="text-[10px] display">IG</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer">
                <span className="text-[10px] display">FB</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {sections.map((section) => (
              <div key={section.id} className="space-y-8">
                <h4 className="text-[11px] display tracking-[0.4em] text-[#d4af37] uppercase">{section.title}</h4>
                {section.links ? (
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link to={link.to} className="text-[11px] display text-white/40 hover:text-white transition-colors tracking-widest uppercase">{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  section.content
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="py-24 border-y border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-md text-center lg:text-left">
            <h3 className="text-3xl serif text-white italic mb-2">Join the Atelier</h3>
            <p className="text-[10px] display text-white/30 tracking-[0.3em] uppercase">Receive exclusive updates and private collection previews.</p>
          </div>
          <div className="flex-1 max-w-md w-full relative">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="w-full bg-transparent px-0 py-6 text-[11px] display tracking-[0.4em] text-white focus:outline-none border-b border-white/10 focus:border-[#d4af37] transition-all placeholder:text-white/20 uppercase"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] display tracking-[0.3em] text-[#d4af37] hover:text-white uppercase font-bold pr-2 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] display tracking-[0.3em] text-white/20 uppercase">
             © {new Date().getFullYear()} Nexa Store. All Rights Reserved. Crafted for the Exceptional.
          </p>
          <div className="flex gap-10 items-center opacity-20 grayscale brightness-200">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Visa_Logo.png" className="h-2" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <VirtualShowroom />
      <ARTeaser />
      <BestsellingSection />
      <SecondaryTeasers />
      <EnhancedReviewSection />
    </>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AppearanceProvider>
      <LanguageProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                </NotificationProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </LanguageProvider>
    </AppearanceProvider>
  );
}

function AppContent() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-brand-bg font-sans text-neutral-900 selection:bg-brand-accent selection:text-white">
      <PWAPrompt />
      <PriceDropMonitor />
      <FlashSaleBanner />
      <Navbar />
      <FlyToCartRenderer />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/profile" element={<AuthPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/track" element={<OrderTracker />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminInventory />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <Footer />
      
      <CartSidebarWrapper />

      {/* Floating Auth Prompt for Guests */}
      <AuthPrompt />

      {/* Admin Quick Entry */}
      <AdminQuickEntry />

      <ChatWidget />
      <WhatsAppButton />
    </div>
  );
}

function CartSidebarWrapper() {
  const { isCartOpen, setIsCartOpen } = useCart();
  return <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />;
}

function AuthPrompt() {
  const { user } = useAuth();
  
  if (user) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-48 right-8 z-[90]"
    >
      <Link 
        to="/profile"
        className="bg-brand-accent text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group border-4 border-white"
      >
        <UserIcon className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 text-xs font-bold uppercase tracking-widest">
          Login / Register
        </span>
      </Link>
    </motion.div>
  );
}

function AdminQuickEntry() {
  const { isAdmin, loading } = useAdmin();
  const { user } = useAuth();

  if (loading || !user || !isAdmin) return null;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-48 left-8 z-[90]"
    >
      <Link 
        to="/admin"
        className="bg-neutral-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group border-4 border-brand-accent/20"
      >
        <ShieldCheck className="w-6 h-6 text-brand-accent" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 text-xs font-bold uppercase tracking-widest">
          Admin Panel
        </span>
      </Link>
    </motion.div>
  );
}
