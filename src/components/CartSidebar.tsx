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
            <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-brand-surface">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-brand-accent" />
                <h2 className="text-xl font-light tracking-tighter text-neutral-900">{lang === 'BN' ? 'আপনার ' : 'Your '}<span className="italic serif text-brand-accent">{lang === 'BN' ? 'ব্যাগ' : 'Bag'}</span></h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-neutral-900" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-8 bg-white">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-300 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]">{t('bagEmpty')}</p>
                </div>
              ) : (
                cart.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-6 group">
                      <div className="w-24 h-28 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100 relative">
                        <img 
                          src={product.images[0]} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1 pt-1">
                          <h4 className="text-xs font-bold text-neutral-900 uppercase leading-tight tracking-[0.05em] serif italic">{product.name}</h4>
                          <p className="text-sm font-bold text-neutral-900">{formatPrice(product.price)}</p>
                        </div>
                        <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-[0.2em] mb-4">
                          {item.variantId ? t('customVariant') : t('standardSelection')}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-6 text-[10px] font-bold border border-neutral-100 rounded-full px-4 py-2 text-neutral-900">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)} className="hover:text-brand-accent transition-colors"><Minus className="w-3 h-3" /></button>
                            <span className="w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)} className="hover:text-brand-accent transition-colors"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.2em] border-b border-neutral-100 hover:text-red-500 transition-colors"
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
            <div className="p-8 bg-brand-surface border-t border-neutral-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[.25em] text-neutral-300">{t('subtotal')}</span>
                <span className="text-2xl font-light text-neutral-900 tracking-tighter">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-[10px] text-neutral-400 mb-8 uppercase tracking-[0.3em] text-center leading-relaxed">
                {t('checkoutDisclaimer')}
              </p>
              <Link 
                to="/checkout"
                onClick={onClose}
                className={cn(
                  "w-full py-5 bg-neutral-900 text-white font-bold uppercase text-[10px] tracking-[.3em] flex items-center justify-center gap-3 hover:bg-brand-accent transition-all duration-500 shadow-xl group rounded-full",
                  cart.length === 0 && "opacity-50 pointer-events-none"
                )}
              >
                {t('checkoutNow')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
