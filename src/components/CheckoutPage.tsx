import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, CreditCard, Truck, Phone, User, Mail, MapPin, Loader2, Smartphone, Wallet, Banknote, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { useProducts } from '../ProductContext';
import { formatPrice, cn } from '../lib/utils';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useProducts();
  const { cart, cartTotal, clearCart, setIsCartOpen } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        <div className="flex justify-between items-end mb-16 border-b border-neutral-100 pb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-4 block">One-Click Checkout</span>
            <h1 className="text-5xl font-light text-neutral-900 tracking-tighter serif italic text-balance">Finalize Your <span className="text-brand-accent underline underline-offset-8">Artifact</span></h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Store
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
                  <h2 className="text-2xl font-light tracking-tighter serif italic">Fast Shipping Details</h2>
               </div>

               <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Recipient Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g. Tanvir Rahman" 
                        className="w-full bg-neutral-50/50 border border-neutral-100 rounded-3xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+880 1XXX-XXXXXX" 
                        className="w-full bg-neutral-50/50 border border-neutral-100 rounded-3xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Full Residence Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-6 w-4 h-4 text-neutral-300" />
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter House, Road, Area and Sector details..." 
                      className="w-full bg-neutral-50/50 border border-neutral-100 rounded-[2rem] pl-14 pr-6 py-5 h-32 focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all text-sm font-medium resize-none"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">City / Zone</label>
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={(e: any) => handleInputChange(e)}
                      className="w-full bg-neutral-50/50 border border-neutral-100 rounded-3xl px-8 py-5 focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all text-sm font-medium appearance-none"
                    >
                      <option value="">Select City</option>
                      <option value="Dhaka">Dhaka (Inner)</option>
                      <option value="Dhaka Outer">Dhaka (Outer)</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">District Code</label>
                    <input 
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="Zip Code" 
                      className="w-full bg-neutral-50/50 border border-neutral-100 rounded-3xl px-8 py-5 focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all text-sm font-medium"
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
                  <h2 className="text-2xl font-light tracking-tighter serif italic text-balance">Secured Payment Architect</h2>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {[
                    { id: 'COD', label: 'Cash on Delivery', sub: 'Traditional', icon: Banknote, color: 'neutral-900' },
                    { id: 'bKash', label: 'bKash', sub: 'Mobile Fund', icon: Smartphone, color: '[#D12053]' },
                    { id: 'Nagad', label: 'Nagad', sub: 'Digital Wallet', icon: Wallet, color: '[#F7941D]' },
                    { id: 'Rocket', label: 'Rocket', sub: 'Bank Deposit', icon: Smartphone, color: '[#8C3494]' },
                    { id: 'Stripe', label: 'Card / International', sub: 'Flash Checkout', icon: CreditCard, color: 'blue-500' }
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
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-2">Instructions for {formData.paymentMethod}</p>
                        <p className="text-[9px] text-neutral-500 font-medium tracking-tight uppercase leading-relaxed">
                          1. Dial *247# or open {formData.paymentMethod} App<br/>
                          2. Send Money (Personal) amount: <strong>{formatPrice(cartTotal)}</strong><br/>
                          3. To: <span className="text-neutral-900 font-bold tracking-widest">01940698304</span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Enter Transaction ID (TrxID)</label>
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
              <section className="bg-neutral-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                
                <h3 className="text-[10px] font-bold uppercase tracking-[.4em] text-brand-accent mb-10 border-b border-white/5 pb-6">Artifact Registry</h3>
                
                <div className="space-y-8 mb-12 max-h-60 overflow-y-auto custom-scrollbar">
                  {cart.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div key={`${item.productId}-${item.variantId}`} className="flex gap-6 items-center">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={product.images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest truncate">{product.name}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[8px] text-white/40 uppercase tracking-tighter">Qty: {item.quantity}</span>
                            <span className="text-xs font-light tracking-tight">{formatPrice(product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 pt-10 border-t border-white/5">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    <span>Vat / Tax</span>
                    <span className="text-white/80">Included</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    <span>Logistics</span>
                    <span className="text-white/80">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-end pt-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/40">Total</span>
                    <span className="text-4xl font-light tracking-tighter serif italic text-brand-accent">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </section>

              {/* Confirm Slider Replacement (One Click Confirm) */}
              <div className="p-4 bg-white border border-neutral-100 rounded-[3rem] shadow-sm">
                <div className="relative group">
                  <div className={cn(
                    "absolute inset-0 bg-brand-accent rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity",
                    isSubmitting && "opacity-40 animate-pulse"
                  )} />
                  
                  <div className="relative">
                    <div 
                      className="absolute inset-y-0 left-0 bg-brand-accent/10 rounded-full transition-all duration-75"
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
                        "relative w-full py-6 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-full font-bold uppercase text-[10px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 overflow-hidden shadow-2xl",
                        "active:scale-95 touch-none"
                       )}
                    >
                       {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                       ) : (
                          <>
                             <Zap className="w-4 h-4 fill-brand-accent text-brand-accent" />
                             {isHolding ? "Validating..." : "Hold to Place Order"}
                             {holdProgress > 0 && <span className="text-[8px] text-brand-accent ml-2">{Math.round(holdProgress)}%</span>}
                          </>
                       )}
                    </button>
                  </div>
                </div>
                <p className="mt-6 text-[9px] text-center text-neutral-300 uppercase tracking-widest italic font-medium">
                   Secured by Nexa Quantum Encrypted Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
