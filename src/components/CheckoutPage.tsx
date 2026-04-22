import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, CreditCard, Truck, Phone, User, Mail, MapPin, Loader2, Smartphone, Wallet, Banknote } from 'lucide-react';
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
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
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
    paymentMethod: 'COD' as 'COD' | 'bKash' | 'Nagad' | 'Rocket',
    txnId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
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
    if (cart.length === 0) {
      alert("Your cart is empty.");
      setIsSubmitting(false);
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
        payment_status: 'pending',
        payment_verified: false,
        method: formData.paymentMethod,
        transaction_id: formData.txnId || `COD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        date: new Date().toLocaleDateString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Submitting order:", orderData);

      // Save to Supabase
      const { error } = await supabase.from('orders').insert(orderData);
      
      if (error) {
        console.error("Supabase Insertion Error:", error);
        throw new Error(`[${error.code}] ${error.message}`);
      }
      
      clearCart();
      navigate('/success');
    } catch (err: any) {
      console.error("Order submission failed:", err);
      alert(`ERROR: ${err.message}\n\nএটি সাধারণত হয় যদি আপনার ডেটাবেসে 'orders' টেবলে পারমিশন না থাকে। দয়া করে আমার দেওয়া SQL কোডটি রান করুন।`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => step === 'payment' ? setStep('shipping') : navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {step === 'payment' ? 'Shipping' : 'Store'}
        </button>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Main Form Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {step === 'shipping' ? (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h1 className="text-3xl font-light text-neutral-900 tracking-tighter">Shipping <span className="serif italic">Details</span></h1>
                  </div>

                  <form onSubmit={handleNextStep} className="space-y-10">
                    {/* Contact Section */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300 mb-6 border-b border-neutral-50 pb-2">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">First Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                            <input 
                              required
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              type="text" 
                              placeholder="John" 
                              className="w-full bg-white border border-neutral-100 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-brand-accent transition-all outline-none text-sm placeholder:opacity-30"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Last Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                            <input 
                              required
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              type="text" 
                              placeholder="Doe" 
                              className="w-full bg-white border border-neutral-100 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-brand-accent transition-all outline-none text-sm placeholder:opacity-30"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Mobile Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                            <input 
                              required
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              type="tel" 
                              placeholder="+880" 
                              className="w-full bg-white border border-neutral-100 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-brand-accent transition-all outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                            <input 
                              required
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              type="email" 
                              placeholder="john@example.com" 
                              className="w-full bg-white border border-neutral-100 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-brand-accent transition-all outline-none text-sm placeholder:opacity-30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300 mb-6 border-b border-neutral-50 pb-2">Shipping Address</h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Street Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-4 h-4 text-neutral-300" />
                            <textarea 
                              required
                              name="address"
                              value={formData.address}
                              onChange={(e: any) => handleInputChange(e)}
                              placeholder="Enter your detailed house address..." 
                              className="w-full bg-white border border-neutral-100 rounded-2xl px-12 py-4 h-32 focus:ring-2 focus:ring-brand-accent transition-all outline-none text-sm resize-none placeholder:opacity-30"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">City</label>
                            <input 
                              required
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              type="text" 
                              placeholder="e.g. Dhaka" 
                              className="w-full bg-white border border-neutral-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-accent transition-all outline-none text-sm placeholder:opacity-30"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Postal / Zip Code</label>
                            <input 
                              required
                              name="zip"
                              value={formData.zip}
                              onChange={handleInputChange}
                              type="text" 
                              placeholder="1234" 
                              className="w-full bg-white border border-neutral-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-accent transition-all outline-none text-sm placeholder:opacity-30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        type="submit"
                        className="w-full py-5 bg-neutral-900 text-white rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent transition-all shadow-xl"
                      >
                        Check & Select Payment
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h1 className="text-3xl font-light text-neutral-900 tracking-tighter">Secure <span className="serif italic">Payment</span></h1>
                  </div>

                  <div className="space-y-8">
                     <div className="grid grid-cols-1 gap-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4 mb-2 block">Choose Payment Method</label>
                        
                        {/* COD Option */}
                        <button 
                           onClick={() => setFormData({...formData, paymentMethod: 'COD'})}
                           className={cn(
                              "flex items-center gap-4 p-6 rounded-3xl border transition-all text-left",
                              formData.paymentMethod === 'COD' ? "bg-neutral-900 border-neutral-900 text-white shadow-xl" : "bg-white border-neutral-100 text-neutral-900 hover:border-brand-accent"
                           )}
                        >
                           <div className={cn("p-3 rounded-2xl", formData.paymentMethod === 'COD' ? "bg-white/10" : "bg-neutral-50")}>
                              <Banknote className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-xs font-bold uppercase tracking-widest">Cash on Delivery</h4>
                              <p className={cn("text-[9px] uppercase tracking-tighter mt-0.5", formData.paymentMethod === 'COD' ? "text-white/60" : "text-neutral-400")}>Pay when you receive the product</p>
                           </div>
                           {formData.paymentMethod === 'COD' && <Check className="w-4 h-4 text-brand-accent" />}
                        </button>

                        {/* bKash Option */}
                        <button 
                           onClick={() => setFormData({...formData, paymentMethod: 'bKash'})}
                           className={cn(
                              "flex items-center gap-4 p-6 rounded-3xl border transition-all text-left",
                              formData.paymentMethod === 'bKash' ? "bg-[#D12053] border-[#D12053] text-white shadow-xl" : "bg-white border-neutral-100 text-neutral-900 hover:border-brand-accent"
                           )}
                        >
                           <div className={cn("p-3 rounded-2xl", formData.paymentMethod === 'bKash' ? "bg-white/10" : "bg-neutral-50")}>
                              <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/BKash_Logo.svg" className="h-5" alt="bKash" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-xs font-bold uppercase tracking-widest">bKash Payment</h4>
                              <p className={cn("text-[9px] uppercase tracking-tighter mt-0.5", formData.paymentMethod === 'bKash' ? "text-white/60" : "text-neutral-400")}>Fast & Secure Mobile Payment</p>
                           </div>
                           {formData.paymentMethod === 'bKash' && <Check className="w-4 h-4 text-white" />}
                        </button>

                        {/* Nagad Option */}
                        <button 
                           onClick={() => setFormData({...formData, paymentMethod: 'Nagad'})}
                           className={cn(
                              "flex items-center gap-4 p-6 rounded-3xl border transition-all text-left",
                              formData.paymentMethod === 'Nagad' ? "bg-[#F7941D] border-[#F7941D] text-white shadow-xl" : "bg-white border-neutral-100 text-neutral-900 hover:border-brand-accent"
                           )}
                        >
                           <div className={cn("p-3 rounded-2xl", formData.paymentMethod === 'Nagad' ? "bg-white/10" : "bg-neutral-50")}>
                              <Wallet className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-xs font-bold uppercase tracking-widest">Nagad Payment</h4>
                              <p className={cn("text-[9px] uppercase tracking-tighter mt-0.5", formData.paymentMethod === 'Nagad' ? "text-white/60" : "text-neutral-400")}>Official Digital Financial Service</p>
                           </div>
                           {formData.paymentMethod === 'Nagad' && <Check className="w-4 h-4 text-white" />}
                        </button>
                        
                        {/* Rocket Option */}
                        <button 
                           onClick={() => setFormData({...formData, paymentMethod: 'Rocket'})}
                           className={cn(
                              "flex items-center gap-4 p-6 rounded-3xl border transition-all text-left",
                              formData.paymentMethod === 'Rocket' ? "bg-[#8C3494] border-[#8C3494] text-white shadow-xl" : "bg-white border-neutral-100 text-neutral-900 hover:border-brand-accent"
                           )}
                        >
                           <div className={cn("p-3 rounded-2xl", formData.paymentMethod === 'Rocket' ? "bg-white/10" : "bg-neutral-50")}>
                              <Smartphone className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-xs font-bold uppercase tracking-widest">DBBL Rocket</h4>
                              <p className={cn("text-[9px] uppercase tracking-tighter mt-0.5", formData.paymentMethod === 'Rocket' ? "text-white/60" : "text-neutral-400")}>Trustworthy Banking Experience</p>
                           </div>
                           {formData.paymentMethod === 'Rocket' && <Check className="w-4 h-4 text-white" />}
                        </button>
                     </div>

                     {/* MFS Instructions & TXN ID Input */}
                     {formData.paymentMethod !== 'COD' && (
                        <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="p-8 bg-brand-surface border border-brand-accent/20 rounded-3xl"
                        >
                           <div className="mb-6">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">Instructions</h4>
                              <p className="text-[10px] text-neutral-600 leading-relaxed uppercase tracking-tighter">
                                 1. Send money (Personal) to: <span className="font-bold text-neutral-900 tracking-wider">01940698304</span><br/>
                                 2. Use your <span className="font-bold text-neutral-900">Phone Number</span> as reference.<br/>
                                 3. Copy and paste the <span className="font-bold text-neutral-900">Transaction ID</span> below.
                              </p>
                           </div>
                           
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Transaction ID</label>
                              <input 
                                 required
                                 type="text"
                                 placeholder="e.g. 8N7K9L2M"
                                 value={formData.txnId}
                                 onChange={(e) => setFormData({...formData, txnId: e.target.value})}
                                 className="w-full bg-white border border-neutral-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-accent transition-all outline-none text-sm placeholder:opacity-30 uppercase font-mono"
                              />
                           </div>
                        </motion.div>
                     )}

                     {/* Final Confirmation Button */}
                     <div className="p-8 bg-white border border-neutral-100 rounded-3xl">
                        <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
                           Total amount to be paid: <strong>{formatPrice(cartTotal)}</strong>. 
                           {formData.paymentMethod === 'COD' ? ' You will pay when the delivery person arrives.' : ' Please ensure the Transaction ID is correct.'}
                        </p>

                        <div className="relative">
                           <div className="absolute inset-0 bg-neutral-100 rounded-full" />
                           <div 
                              className="absolute inset-y-0 left-0 bg-brand-accent rounded-full transition-all duration-75"
                              style={{ width: `${holdProgress}%` }}
                           />
                           <button
                             onMouseDown={() => {
                               if (formData.paymentMethod !== 'COD' && !formData.txnId) {
                                  alert("Please enter a Transaction ID for MFS payment.");
                                  return;
                               }
                               setIsHolding(true);
                             }}
                             onMouseUp={() => setIsHolding(false)}
                             onMouseLeave={() => setIsHolding(false)}
                             onTouchStart={() => {
                                if (formData.paymentMethod !== 'COD' && !formData.txnId) {
                                   alert("Please enter a Transaction ID for MFS payment.");
                                   return;
                                }
                                setIsHolding(true);
                             }}
                             onTouchEnd={() => setIsHolding(false)}
                             className="relative w-full py-6 text-white font-bold uppercase text-[10px] tracking-[0.3em] z-10 select-none cursor-pointer overflow-hidden flex items-center justify-center gap-3"
                           >
                              {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : isHolding ? 'Verifying...' : 'Hold to Confirm Order'}
                              {holdProgress > 0 && <span className="text-[8px] opacity-70">{Math.round(holdProgress)}%</span>}
                           </button>
                        </div>
                        
                        <p className="mt-6 text-[8px] text-center text-neutral-400 uppercase tracking-widest font-bold">
                           <Check className="inline-block w-3 h-3 mr-1" /> Nexa Luxury Guarantee Integrated
                        </p>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-neutral-100 rounded-3xl p-8 sticky top-32">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 mb-8 pb-4 border-b border-neutral-50">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-72 overflow-y-auto">
                {cart.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                   if (!product) return null;
                   return (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                         <img src={product.images[0]} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-[10px] font-bold text-neutral-900 uppercase truncate">{product.name}</h4>
                         <p className="text-[10px] text-neutral-400 uppercase">Qty: {item.quantity}</p>
                         <p className="text-xs font-bold text-neutral-900 mt-1">{formatPrice(product.price * item.quantity)}</p>
                      </div>
                    </div>
                   );
                })}
              </div>

              <div className="space-y-3 pt-8 border-t border-neutral-50">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  <span>Shipping</span>
                  <span>Calculated</span>
                </div>
                <div className="flex justify-between text-xl font-light text-neutral-900 tracking-tighter pt-4">
                   <span>Total</span>
                   <span className="serif italic text-brand-accent">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
