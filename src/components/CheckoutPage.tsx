import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, CreditCard, Truck, Phone, User, Mail, MapPin, Loader2, Smartphone, Wallet, Banknote, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { useProducts } from '../ProductContext';
import { formatPrice, cn } from '../lib/utils';
import { useLanguage } from '../LanguageContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useProducts();
  const { cart, cartTotal, clearCart, setIsCartOpen } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, lang } = useLanguage();
  
  // Close cart on mount
  useEffect(() => {
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '+880 ',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'COD' as 'COD' | 'bKash' | 'Nagad' | 'Rocket' | 'Stripe',
    txnId: '',
    isGuest: !user
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let interval: any;
    if (isHolding && !isSubmitting) {
      interval = setInterval(() => {
        setHoldProgress(prev => Math.min(prev + 2, 100));
      }, 30);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, isSubmitting]);

  useEffect(() => {
    if (holdProgress >= 100 && !isSubmitting) {
      handleConfirm();
    }
  }, [holdProgress]);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    
    // Basic Validation
    if (!formData.firstName || !formData.phone || !formData.address) {
      alert("Please fill in basic shipping details first.");
      setIsHolding(false);
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        user_id: user?.id || null,
        customer: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        shipping_details: {
          address: formData.address,
          city: formData.city,
          zip: formData.zip
        },
        items: cart.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            name: product?.name || 'Unknown Product',
            price: product?.price || 0,
            quantity: item.quantity,
            variantId: item.variantId || null
          };
        }),
        total: cartTotal,
        status: 'Pending',
        payment_status: formData.paymentMethod === 'COD' ? 'pending' : 'paid',
        payment_verified: formData.paymentMethod === 'Stripe',
        method: formData.paymentMethod,
        transaction_id: formData.txnId || `${formData.paymentMethod}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        date: new Date().toLocaleDateString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to Supabase
      const { error } = await supabase.from('orders').insert(orderData);
      
      if (error) throw error;
      
      clearCart();
      navigate('/success');
    } catch (err: any) {
      console.error("Order submission failed:", err);
      alert(`Submission Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 border-b border-neutral-50 pb-12">
          <div className="mb-8 md:mb-0">
            <span className="text-[10px] display tracking-[0.6em] text-brand-gold mb-6 block uppercase">Curation Finalization</span>
            <h1 className="text-5xl md:text-7xl serif italic text-brand-accent tracking-tighter text-balance">The Checkout</h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-4 text-[10px] display tracking-[0.3em] text-neutral-400 hover:text-brand-accent transition-all duration-500 uppercase"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
            {t('returnToStore')}
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-20">
          {/* Main Form Fields */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Step 1: Shipping */}
            <section className="bg-white p-12 rounded-[3.5rem] border border-neutral-100 shadow-xl relative overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-light tracking-tighter serif italic">{t('shippingDetailsHeader')}</h2>
               </div>

                <div className="grid md:grid-cols-2 gap-12 mb-12">
                   <div className="space-y-4">
                     <label className="text-[10px] display tracking-widest text-[#d4af37] uppercase">{t('recipientName')}</label>
                     <div className="relative">
                       <User className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
                       <input 
                         name="firstName"
                         value={formData.firstName}
                         onChange={handleInputChange}
                         placeholder="e.g. Tanvir Rahman" 
                         className="w-full bg-transparent border-b border-neutral-100 py-4 focus:border-brand-gold outline-none transition-all text-base font-light"
                       />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <label className="text-[10px] display tracking-widest text-[#d4af37] uppercase">{t('contactPhone')}</label>
                     <div className="relative">
                       <Phone className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
                       <input 
                         name="phone"
                         value={formData.phone}
                         onChange={handleInputChange}
                         placeholder="+880 1XXX-XXXXXX" 
                         className="w-full bg-transparent border-b border-neutral-100 py-4 focus:border-brand-gold outline-none transition-all text-base font-light"
                       />
                     </div>
                   </div>
                </div>

                <div className="space-y-4 mb-12">
                   <label className="text-[10px] display tracking-widest text-[#d4af37] uppercase">{t('residenceAddress')}</label>
                   <div className="relative">
                     <MapPin className="absolute right-0 top-4 w-3.5 h-3.5 text-neutral-300" />
                     <textarea 
                       name="address"
                       value={formData.address}
                       onChange={handleInputChange}
                       placeholder="Enter House, Road, Area and Sector details..." 
                       className="w-full bg-transparent border-b border-neutral-100 py-4 h-24 focus:border-brand-gold outline-none transition-all text-base font-light resize-none leading-relaxed"
                     />
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                     <label className="text-[10px] display tracking-widest text-[#d4af37] uppercase">{t('cityZone')}</label>
                     <div className="relative">
                        <select 
                          name="city"
                          value={formData.city}
                          onChange={(e: any) => handleInputChange(e)}
                          className="w-full bg-transparent border-b border-neutral-100 py-4 focus:border-brand-gold outline-none transition-all text-base font-light appearance-none"
                        >
                          <option value="">{t('selectCity')}</option>
                          <option value="Dhaka">{lang === 'BN' ? 'ঢাকা (ভিতরে)' : 'Dhaka (Inner)'}</option>
                          <option value="Dhaka Outer">{lang === 'BN' ? 'ঢাকা (বাইরে)' : 'Dhaka (Outer)'}</option>
                          <option value="Chittagong">{lang === 'BN' ? 'চট্টগ্রাম' : 'Chittagong'}</option>
                          <option value="Sylhet">{lang === 'BN' ? 'সিলেট' : 'Sylhet'}</option>
                          <option value="Rajshahi">{lang === 'BN' ? 'রাজশাহী' : 'Rajshahi'}</option>
                        </select>
                        <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none rotate-90" />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <label className="text-[10px] display tracking-widest text-[#d4af37] uppercase">{t('districtCode')}</label>
                     <input 
                       name="zip"
                       value={formData.zip}
                       onChange={handleInputChange}
                       placeholder="Zip Code" 
                       className="w-full bg-transparent border-b border-neutral-100 py-4 focus:border-brand-gold outline-none transition-all text-base font-light"
                     />
                   </div>
                </div>
            </section>

            {/* Step 2: Payment */}
            <section className="bg-white p-12 rounded-[3.5rem] border border-neutral-100 shadow-xl">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-light tracking-tighter serif italic text-balance">{t('paymentArchitect')}</h2>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {[
                    { id: 'COD', label: t('cashOnDelivery'), sub: lang === 'BN' ? 'সনাতন' : 'Traditional', icon: Banknote, color: 'neutral-900' },
                    { id: 'bKash', label: 'bKash', sub: lang === 'BN' ? 'মোবাইল ফান্ড' : 'Mobile Fund', icon: Smartphone, color: '[#D12053]' },
                    { id: 'Nagad', label: 'Nagad', sub: lang === 'BN' ? 'ডিজিটাল ওয়ালেট' : 'Digital Wallet', icon: Wallet, color: '[#F7941D]' },
                    { id: 'Rocket', label: 'Rocket', sub: lang === 'BN' ? 'ব্যাংক ডিপোজিট' : 'Bank Deposit', icon: Smartphone, color: '[#8C3494]' },
                    { id: 'Stripe', label: lang === 'BN' ? 'কার্ড / ইন্টারন্যাশনাল' : 'Card / International', sub: lang === 'BN' ? 'ফ্ল্যাশ চেকআউট' : 'Flash Checkout', icon: CreditCard, color: 'blue-500' }
                  ].map((p) => (
                    <button 
                      key={p.id}
                      onClick={() => setFormData({...formData, paymentMethod: p.id as any})}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col justify-between h-40",
                        formData.paymentMethod === p.id 
                          ? `border-brand-accent bg-neutral-900 text-white shadow-xl` 
                          : "border-neutral-50 bg-neutral-50/30 text-neutral-900 hover:border-neutral-200"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", formData.paymentMethod === p.id ? "bg-white/10" : "bg-white shadow-sm")}>
                        <p.icon className={cn("w-5 h-5", formData.paymentMethod === p.id ? "text-brand-accent" : "text-neutral-400")} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">{p.label}</h4>
                        <p className={cn("text-[8px] uppercase tracking-tighter opacity-40")}>{p.sub}</p>
                      </div>
                    </button>
                  ))}
               </div>

               {/* MFS Verification Area */}
               {formData.paymentMethod !== 'COD' && formData.paymentMethod !== 'Stripe' && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="bg-neutral-50 p-8 rounded-[2rem] mb-10 border border-neutral-100"
                 >
                    <div className="flex gap-4 items-start mb-6">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-accent shadow-sm">!</div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-2">{lang === 'BN' ? `${formData.paymentMethod} এর নিয়মাবলী` : `Instructions for ${formData.paymentMethod}`}</p>
                        <p className="text-[9px] text-neutral-500 font-medium tracking-tight uppercase leading-relaxed">
                          1. {lang === 'BN' ? '*২৪৭# ডায়াল করুন অথবা অ্যাপটি খুলুন' : `Dial *247# or open ${formData.paymentMethod} App`}<br/>
                          2. {lang === 'BN' ? 'Send Money করুন :' : 'Send Money (Personal) amount:'} <strong>{formatPrice(cartTotal)}</strong><br/>
                          3. {lang === 'BN' ? 'প্রাপক মোবাইল নম্বর :' : 'To:'} <span className="text-neutral-900 font-bold tracking-widest">01940698304</span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">{lang === 'BN' ? 'Transaction ID (TrxID) দিন' : 'Enter Transaction ID (TrxID)'}</label>
                      <input 
                        name="txnId"
                        value={formData.txnId}
                        onChange={handleInputChange}
                        placeholder="E.G. 8H7K2L..." 
                        className="w-full bg-white border border-neutral-100 rounded-3xl px-8 py-5 focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all text-sm font-mono tracking-widest uppercase"
                      />
                    </div>
                 </motion.div>
               )}

               {formData.paymentMethod === 'Stripe' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-10 border-2 border-dashed border-neutral-100 rounded-[2rem] text-center mb-10"
                  >
                     <CreditCard className="w-12 h-12 text-neutral-100 mx-auto mb-4" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Secured Visa / Mastercard / Amex Gateway</p>
                     <p className="text-[8px] text-neutral-300 font-bold uppercase tracking-[0.3em]">Redirection handled via Stripe Relay™</p>
                  </motion.div>
               )}
            </section>
          </div>

          {/* Right Sidebar: Summary and Final One-Click Confirm */}
          <div className="lg:col-span-4 h-full">
            <div className="sticky top-32 space-y-8">
              <section className="bg-brand-accent text-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
                
                <h3 className="text-[10px] display tracking-[0.5em] text-brand-gold mb-12 border-b border-white/5 pb-8 uppercase">{t('artifactRegistry')}</h3>
                
                <div className="space-y-10 mb-16 max-h-[400px] overflow-y-auto px-1 pr-6 custom-scrollbar">
                  {cart.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div key={`${item.productId}-${item.variantId}`} className="flex gap-8 items-center group">
                        <div className="w-16 h-20 bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={product.images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm serif italic text-white/90 truncate mb-2">{product.name}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] display tracking-widest text-[#d4af37]/60 uppercase">Qty: {item.quantity}</span>
                            <span className="text-sm serif text-white">{formatPrice(product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-6 pt-12 border-t border-white/10">
                  <div className="flex justify-between text-[10px] display tracking-widest text-white/40 uppercase">
                    <span>Tax & Duties</span>
                    <span className="text-white/80">{t('included')}</span>
                  </div>
                  <div className="flex justify-between text-[10px] display tracking-widest text-white/40 uppercase">
                    <span>Concierge Logistics</span>
                    <span className="text-white/80 italic serif lowercase">{t('complimentary')}</span>
                  </div>
                  <div className="flex justify-between items-end pt-8">
                    <span className="text-[10px] display tracking-[0.4em] text-[#d4af37] uppercase mb-1">{t('totalText')}</span>
                    <span className="text-5xl serif tracking-tighter text-white italic">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </section>

              {/* Confirm Slider Replacement (One Click Confirm) */}
              <div className="p-4 bg-white border border-neutral-100 rounded-[3rem] shadow-sm overflow-hidden">
                <div className="relative group">
                  <div className={cn(
                    "absolute inset-0 bg-brand-gold rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-700",
                    isSubmitting && "opacity-30 animate-pulse"
                  )} />
                  
                  <div className="relative">
                    <div 
                      className="absolute inset-y-0 left-0 bg-brand-gold rounded-full transition-all duration-75 shadow-inner"
                      style={{ width: `${holdProgress}%` }}
                    />
                    
                    <button
                       onMouseDown={() => setIsHolding(true)}
                       onMouseUp={() => setIsHolding(false)}
                       onMouseLeave={() => setIsHolding(false)}
                       onTouchStart={() => setIsHolding(true)}
                       onTouchEnd={() => setIsHolding(false)}
                       disabled={isSubmitting}
                       className={cn(
                        "relative w-full py-8 bg-neutral-900 border border-white/5 disabled:bg-neutral-100 text-white rounded-full text-[11px] display tracking-[0.5em] transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden shadow-2xl",
                        "active:scale-95 touch-none group hover:bg-neutral-800"
                       )}
                    >
                       {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
                       ) : (
                          <>
                             <div className="relative">
                               <div className="absolute inset-0 bg-brand-gold rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                               <Zap className="w-4 h-4 fill-brand-gold text-brand-gold relative z-10" />
                             </div>
                             {isHolding ? t('validating') : t('holdToPlaceOrder')}
                             {holdProgress > 0 && <span className="text-[10px] text-brand-gold ml-2 italic serif">{Math.round(holdProgress)}%</span>}
                          </>
                       )}
                    </button>
                  </div>
                </div>
                <p className="mt-8 text-[9px] text-center text-neutral-300 display tracking-[0.3em] uppercase leading-relaxed">
                   Secured via <span className="text-neutral-900">Nexa Quantum™</span> Encrypted Gateway
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
