import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Zap, Plus, Minus, ShieldCheck, ArrowRight, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../CartContext';
import { useLanguage } from '../LanguageContext';
import { Link, useNavigate } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedVariantData, setSelectedVariantData] = useState<any>(null);

  if (!product) return null;

  const handleVariantSelect = (variantId: string, variantData: any) => {
    setSelectedVariant(variantId);
    setSelectedVariantData(variantData);
    if (variantData.image) {
      const imgIdx = product.images.indexOf(variantData.image);
      if (imgIdx !== -1) {
        setActiveImage(imgIdx);
      }
    }
  };

  const currentDisplayImage = selectedVariantData?.image || product.images[activeImage];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 p-3 bg-white/10 backdrop-blur-md hover:bg-neutral-900 hover:text-white rounded-full transition-all border border-black/5"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Images */}
            <div className="w-full md:w-1/2 p-10 bg-brand-surface relative overflow-hidden flex flex-col">
              <div className="flex-1 rounded-[2rem] overflow-hidden relative group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentDisplayImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={currentDisplayImage}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.badges.map(b => (
                    <span key={b} className="text-[7px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 bg-neutral-900 text-white rounded-full">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-6 justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => {
                        setActiveImage(i);
                        setSelectedVariantData(null);
                    }}
                    className={cn(
                      "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                      (activeImage === i && !selectedVariantData?.image) ? "border-brand-accent" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 p-10 md:p-14 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4">
                  <span>{product.category}</span>
                </div>
                <h2 className="text-3xl font-light text-neutral-900 tracking-tighter serif italic mb-2">{product.name}</h2>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-light text-brand-accent tracking-tighter">{formatPrice(product.price)}</span>
                  {product.stock > 0 && (
                    <span className="text-[8px] font-bold uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1 rounded-full">
                      {t('stock')}: {product.stock}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-light text-neutral-500 leading-relaxed mb-10 line-clamp-3">
                {product.description}
              </p>

              {/* Configuration */}
              <div className="space-y-8 mb-10">
                {product.variants?.map((v) => (
                  <div key={v.type}>
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300 mb-4">{v.type} Selection</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {v.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleVariantSelect(opt.id, opt)}
                          className={cn(
                            "flex justify-between items-center p-4 rounded-xl text-[9px] font-bold uppercase tracking-[0.1em] border transition-all",
                            selectedVariant === opt.id 
                              ? "bg-neutral-900 text-white border-neutral-900" 
                              : "bg-white text-neutral-900 border-neutral-100 hover:border-neutral-300"
                          )}
                        >
                          <span>{opt.name}</span>
                          {selectedVariant === opt.id && <ShieldCheck className="w-3 h-3 text-brand-accent" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-8 border-t border-neutral-100">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6 px-6 py-3 rounded-full border border-neutral-100 bg-neutral-50">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-3 h-3 text-neutral-900" /></button>
                      <span className="w-4 text-center font-bold text-xs tracking-widest text-neutral-900">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}><Plus className="w-3 h-3 text-neutral-900" /></button>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        addToCart(product.id, quantity, selectedVariant || undefined, e);
                        onClose();
                      }}
                      className="flex-1 py-4 bg-white border border-neutral-900 text-neutral-900 font-bold uppercase text-[9px] tracking-[0.3em] rounded-full flex items-center justify-center gap-2 hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {t('addToBag')}
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => {
                        addToCart(product.id, quantity, selectedVariant || undefined, e);
                        navigate('/checkout');
                        onClose();
                      }}
                      className="flex-1 py-4 bg-brand-accent text-white font-bold uppercase text-[9px] tracking-[0.3em] rounded-full flex items-center justify-center gap-2 hover:bg-neutral-900 transition-all shadow-xl shadow-brand-accent/20"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      {t('buyNow')}
                    </button>
                    
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-center px-6 py-4 border border-neutral-100 rounded-full hover:bg-neutral-50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
