import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../CartContext';
import { useProducts } from '../ProductContext';
import { useLanguage } from '../LanguageContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartProps) {
  const { products } = useProducts();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { t, lang } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl border-l border-neutral-100"
          >
            {/* Header */}
            <div className="p-8 md:p-12 flex justify-between items-center bg-white border-b border-neutral-50">
              <div>
                <span className="text-[10px] display tracking-[0.4em] text-brand-gold mb-2 block uppercase">Your Selection</span>
                <h2 className="text-3xl serif italic text-brand-accent">{lang === 'BN' ? 'ব্যাগ' : 'The Bag'}</h2>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 rounded-full transition-all duration-500 hover:rotate-90"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 flex flex-col gap-12 bg-white">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-300 gap-6">
                  <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 opacity-40" />
                  </div>
                  <p className="text-[10px] display tracking-[0.4em] uppercase">{t('bagEmpty')}</p>
                </div>
              ) : (
                cart.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-8 group">
                      <div className="w-28 h-36 bg-neutral-50 rounded-sm overflow-hidden border border-neutral-100 relative">
                        <img 
                          src={product.images[0]} 
                          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm serif italic text-brand-accent leading-tight tracking-tight">{product.name}</h4>
                            <p className="text-sm serif text-brand-accent ml-4">{formatPrice(product.price)}</p>
                          </div>
                          <p className="text-[9px] text-[#d4af37] display tracking-[0.2em] uppercase mb-4">
                            {item.variantId ? t('customVariant') : t('standardSelection')}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-end border-t border-neutral-50 pt-4">
                          <div className="flex items-center gap-8 text-[10px] display text-neutral-900 bg-neutral-50 px-4 py-2 rounded-sm border border-neutral-100">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)} className="hover:text-brand-gold transition-colors"><Minus className="w-3 h-3" /></button>
                            <span className="w-4 text-center font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)} className="hover:text-brand-gold transition-colors"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            className="text-[9px] display tracking-[0.2em] text-neutral-300 hover:text-red-400 transition-colors uppercase border-b border-white hover:border-red-400"
                          >
                            {t('removeText')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-8 md:p-12 bg-neutral-900 text-white border-t border-white/5 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <span className="text-[10px] display tracking-[0.4em] text-[#d4af37] uppercase mb-2 block">{t('subtotal')}</span>
                    <span className="text-sm text-white/40 display tracking-widest">(VAT & Duties included)</span>
                  </div>
                  <span className="text-4xl serif tracking-tighter text-white">{formatPrice(cartTotal)}</span>
                </div>
                
                <Link 
                  to="/checkout"
                  onClick={onClose}
                  className={cn(
                    "w-full py-6 bg-brand-gold text-white text-[11px] display tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-white hover:text-brand-accent transition-all duration-700 shadow-2xl group",
                    cart.length === 0 && "opacity-50 pointer-events-none"
                  )}
                >
                  {t('checkoutNow')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-3" />
                </Link>
                
                <p className="mt-8 text-[9px] text-white/30 display tracking-[0.3em] text-center leading-relaxed">
                  COMPLIMENTARY SHIPPING ON ALL BESPOKE ORDERS
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
