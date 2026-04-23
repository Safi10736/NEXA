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
import AdminDashboard from './pages/admin/Dashboard';
import AdminInventory from './pages/admin/Inventory';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import { Star, MessageCircle, Instagram, Twitter, Facebook, ArrowRight, User as UserIcon, ShieldCheck, BarChart3, Linkedin, Youtube, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';
import ProductCard from './components/ProductCard';

import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider, useCart } from './CartContext';
import { ProductProvider, useProducts } from './ProductContext';
import { WishlistProvider } from './WishlistContext';
import FlyToCartRenderer from './components/FlyToCart';
import { useAdmin } from './hooks/useAdmin';

function FeaturedCollections() {
  const items = [
    { title: 'Explore CupEco', img: 'https://images.unsplash.com/photo-1544787210-22c66d137f6d?auto=format&fit=crop&q=80&w=800' },
    { title: 'Explore Tealyvory', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800' },
    { title: 'Explore NatureSip', img: 'https://images.unsplash.com/photo-1610631880197-484c399c922c?auto=format&fit=crop&q=80&w=800' },
    { title: 'Explore FreshPitcher', img: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 mt-12 mb-24">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="relative h-72 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all"
        >
          <img src={item.img} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-x-4 bottom-6 text-center">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3 opacity-90 group-hover:opacity-100">{item.title}</h4>
            <Link to="/shop" className="inline-block bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[7px] font-bold uppercase tracking-widest text-neutral-900 group-hover:bg-brand-accent group-hover:text-white transition-all">
              Shop Now
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
  return (
    <section id="bestsellers" className="py-24 px-6 bg-brand-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.43em] uppercase text-brand-muted mb-4 block">Eco Essentials Planet-Friendly</span>
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 tracking-tighter">
               {lang === 'BN' ? (
                 <>সেরা <span className="serif italic text-brand-accent">পণ্য</span></>
               ) : (
                 <>Bestselling <span className="serif italic text-brand-accent">Products</span></>
               )}
            </h2>
          </div>
          <Link to="/shop" className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-900 border-b border-neutral-200 pb-1 hover:border-brand-accent transition-all group">
            {lang === 'BN' ? 'আরও পণ্য' : 'More products'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((p) => (
             <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SecondaryTeasers() {
  const { t, lang } = useLanguage();
  return (
    <section className="py-24 px-6 bg-brand-surface border-y border-neutral-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24">
        {/* Gallery Grid */}
        <div>
           <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-muted mb-8 block">Inspiration & Gallery</span>
           <div className="grid grid-cols-3 gap-3">
              {[
                'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1610631880197-484c399c922c?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1544787210-22c66d137f6d?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1616489953149-8083070be0bc?auto=format&fit=crop&q=80&w=400'
              ].map((img, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0 }} 
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer"
                >
                  <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </motion.div>
              ))}
           </div>
        </div>

        {/* Brand Commitment Teaser */}
        <div className="flex flex-col justify-center">
           <h3 className="text-4xl font-light text-neutral-900 tracking-tighter mb-8 serif italic leading-tight">
             {lang === 'BN' ? 'চিন্তাশীল, গ্রহ-বান্ধব আইডিয়া এবং অনুপ্রেরণা গ্যালারি' : 'Thoughtful, Planet-Prioritizing Ideas and Inspiration Gallery'}
           </h3>
           <p className="text-sm text-neutral-500 font-light leading-relaxed mb-10 max-w-sm">
             {lang === 'BN' ? 'টেকসই উপকরণ, কম-প্রভাব উৎপাদন এবং নৈতিক উৎস অংশীদারিত্বের প্রতি আমাদের প্রতিশ্রুতি আবিষ্কার করুন।' : 'Discover our commitment to sustainable materials, low-impact production, and ethical sourcing partnerships — all crafted to support a healthier planet and a greener lifestyle.'}
           </p>
           <div className="flex gap-4">
              <Link 
                to="/about"
                className="px-8 py-3 bg-neutral-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all inline-block"
              >
                {lang === 'BN' ? 'আরও জানুন' : 'Learn More'}
              </Link>
           </div>
        </div>
      </div>
    </section>
  );
}

function EnhancedReviewSection() {
  return (
    <section className="py-24 px-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-12 items-start">
          {/* Big Rating Card */}
          <div className="lg:col-span-1 bg-white border border-neutral-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center">
             <span className="text-6xl font-light text-neutral-900 tracking-tighter mb-4">4.9<span className="text-2xl text-neutral-300">/5</span></span>
             <div className="flex text-brand-gold mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
             </div>
             <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-400">9k+ User Reviews For Our Award Winning Eco Products</p>
          </div>

          {/* Individual Reviews */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="p-8 bg-brand-surface rounded-2xl border border-neutral-100">
                <div className="flex text-brand-gold mb-6">
                   {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-3 h-3 fill-current", i >= review.rating && "text-neutral-200")} />)}
                </div>
                <p className="text-sm font-light text-neutral-600 italic leading-relaxed mb-8">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold uppercase">{review.userName[0]}</div>
                   <div>
                      <h4 className="text-[10px] font-bold text-neutral-900 uppercase tracking-tight">{review.userName}</h4>
                      <p className="text-[8px] text-green-600 font-bold uppercase">Verified Buyer</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { t, lang } = useLanguage();

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    {
      id: 'help',
      title: t('help'),
      links: [
        { label: t('shipping'), to: '/support#shipping' },
        { label: t('returns'), to: '/support#returns' },
        { label: lang === 'BN' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy', to: '/support#privacy' },
        { label: lang === 'BN' ? 'শর্তাবলী' : 'Terms & Conditions', to: '/support#terms' }
      ]
    },
    {
      id: 'about',
      title: t('about'),
      links: [
        { label: lang === 'BN' ? 'আমাদের সম্পর্কে' : 'About Us', to: '/about' },
        { label: lang === 'BN' ? 'আমাদের যাত্রা' : 'Our Story', to: '/about' },
        { label: lang === 'BN' ? 'ক্যারিয়ার' : 'Career', to: '#' }
      ]
    },
    {
      id: 'account',
      title: t('accountKey'),
      links: [
        { label: t('login'), to: '/profile' },
        { label: lang === 'BN' ? 'নিবন্ধন' : 'Register', to: '/profile' },
        { label: lang === 'BN' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard', to: '/admin' }
      ]
    },
    {
      id: 'contact',
      title: t('contact'),
      content: (
        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-loose text-left">
          <p className="text-neutral-900 border-b border-neutral-100 mb-2 pb-1 inline-block">{t('dhakaOffice')}</p>
          <p>Nexa Luxury Atelier, Level-5</p>
          <p>Banani Crescent, Road No-12</p>
          <p>Gulshan-02, Dhaka-1212</p>
          <p className="mt-2 text-neutral-600">{t('phone')}: +880 1234 567 890</p>
          <p className="text-neutral-400 font-medium">(10 AM - 8 PM)</p>
          <p className="text-neutral-400 font-medium italic">({lang === 'BN' ? 'সরকারি ছুটির দিনে বন্ধ' : 'Closed on Govt. Holidays'})</p>
          <p className="mt-2 text-neutral-600">{t('email')}: concierge@nexastore.com</p>
        </div>
      )
    },
    {
       id: 'stores',
       title: lang === 'BN' ? 'স্টোর লোকেশন' : 'Store Locations',
       links: [{ label: lang === 'BN' ? 'ঢাকা' : 'Dhaka', to: '#' }, { label: lang === 'BN' ? 'চট্টগ্রাম' : 'Chittagong', to: '#' }]
    }
  ];

  return (
    <footer className="bg-white pt-24 pb-12 px-6 border-t border-neutral-100 flex flex-col items-center">
      {/* Follow Us */}
      <div className="flex flex-col items-center mb-16">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-neutral-900">{t('followUs')}</h3>
        <div className="flex gap-5">
          {[
            { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/share/1CiNRxyy6M/" },
            { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/nexa_124?igsh=MXBoN2N3ZnJyenh1bw==" },
            { icon: <Linkedin className="w-5 h-5" />, href: "#" },
            { icon: <Youtube className="w-5 h-5" />, href: "#" }
          ].map((social, i) => (
            <a 
              key={i} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-500 shadow-sm hover:shadow-xl"
            >
              {social.icon}
            </a>
          ))}
        </div>
        <p className="mt-10 text-[10px] text-neutral-300 font-bold uppercase tracking-[0.3em]">TRAD/DNCC/021994/2026</p>
      </div>

      {/* Main Sections - Mobile Accordion / Desktop Grid */}
      <div className="max-w-7xl w-full mx-auto md:grid md:grid-cols-5 md:gap-12 py-10 border-t border-b border-neutral-50">
        {sections.map((section) => (
          <div key={section.id} className="border-b md:border-b-0 border-neutral-50 last:border-b-0">
            <button 
              onClick={() => toggleSection(section.id)}
              className="w-full flex justify-between items-center py-7 md:py-0 md:mb-10 text-left group"
            >
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-900 group-hover:text-brand-accent transition-colors">{section.title}</h4>
              <div className="md:hidden transition-transform duration-300" style={{ transform: openSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                {openSection === section.id ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
              </div>
            </button>
            
            <div className={cn(
              "md:block transition-all duration-500 overflow-hidden",
              openSection === section.id ? "block pb-8" : "hidden md:block"
            )}>
               <div className="flex flex-col gap-5 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                 {section.links?.map((link, i) => (
                   <Link 
                    key={i} 
                    to={link.to} 
                    className="hover:text-brand-accent transition-all cursor-pointer hover:pl-2 flex items-center group"
                   >
                     <span className="w-0 h-px bg-brand-accent group-hover:w-5 transition-all mr-0 group-hover:mr-2"></span>
                     {link.label}
                   </Link>
                 ))}
                 {section.content}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe */}
      <div className="max-w-2xl w-full mx-auto text-center py-24 px-6">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] mb-6 text-neutral-900 underline underline-offset-[12px] decoration-neutral-100">{t('subscribe')}</h3>
        <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-12">{t('subscribeDesc')}</p>
        <div className="flex flex-col sm:flex-row gap-0 border border-neutral-100 p-1 rounded-sm focus-within:border-neutral-900 transition-colors">
          <input 
            type="email" 
            placeholder={lang === 'BN' ? 'আপনার ইমেইল ঠিকানা দিন...' : 'Enter your email address...'}
            className="flex-1 px-8 py-5 focus:outline-none text-[10px] font-bold uppercase tracking-widest text-neutral-900 placeholder:text-neutral-300"
          />
          <button className="bg-neutral-900 text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-accent transition-all">
            {t('signUp')}
          </button>
        </div>
      </div>

      {/* Payment & Copyright */}
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center gap-12 border-t border-neutral-50 pt-16">
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Google_Pay_Logo.svg" alt="Google Pay" className="h-5" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Stripe_logo%2C_revised_2016.svg" alt="Stripe" className="h-10" referrerPolicy="no-referrer" />
        </div>
        <p className="text-[9px] text-neutral-300 uppercase tracking-[0.4em] font-bold text-center leading-loose">
          © 2026 Nexa Luxury Store — Handcrafted with obsession. All rights reserved.
          <Link to="/admin" className="ml-4 text-neutral-200 hover:text-brand-accent transition-colors underline underline-offset-4">Admin Access</Link>
        </p>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
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

import { LanguageProvider, useLanguage } from './LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

function AppContent() {
  const { t, lang } = useLanguage();
  
  return (
    <div className="min-h-screen bg-brand-bg font-sans text-neutral-900 selection:bg-brand-accent selection:text-white">
      <Navbar />
      <FlyToCartRenderer />
      
      <Routes>
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
        <Route path="/admin/settings" element={<AdminDashboard />} />
      </Routes>

      <Footer />
      
      <CartSidebarWrapper />

      {/* Floating Auth Prompt for Guests */}
      <AuthPrompt />

      {/* Admin Quick Entry */}
      <AdminQuickEntry />

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/your-number" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 text-xs font-bold uppercase tracking-widest">
          {t('contact')}
        </span>
      </a>
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
      className="fixed bottom-28 right-8 z-[90]"
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
      className="fixed bottom-28 left-8 z-[90]"
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
