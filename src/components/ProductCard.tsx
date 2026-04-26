import React, { useState } from 'react';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { ShoppingBag, Eye, Heart, Plus, Zap, Search, CheckCircle2, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { useLanguage } from '../LanguageContext';

export const ProductCard: React.FC<{ product: Product, onQuickView?: (product: Product) => void }> = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { addToCart, setIsDraggingProduct } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    addToCart(product.id, 1, undefined, e as any);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const containerVariants = {
    initial: {},
    hover: {}
  };

  const contentVariants = {
    initial: { y: 40, opacity: 0 },
    hover: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    hover: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={containerVariants}
      className="group relative bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/20 dark:border-white/10 transition-all duration-700 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-brand-accent/30"
    >
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-brand-surface dark:bg-neutral-900 pointer-events-auto">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-accent text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
            <Smartphone className="w-3 h-3" />
            AR Ready
          </div>
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] rounded-full backdrop-blur-xl border border-white/20 text-neutral-900 dark:text-white bg-white/20 dark:bg-black/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Info Overlay for non-hover state on mobile */}
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/20 to-transparent md:hidden">
           <h4 className="text-white text-xs font-bold uppercase tracking-widest">{product.name}</h4>
        </div>
      </Link>

      {/* Draggable Handle - Keep separate to prevent link trigger on drag */}
      <motion.div
        drag
        dragSnapToOrigin
        dragElastic={0.1}
        onDragStart={() => setIsDraggingProduct(true)}
        onDragEnd={(_, info) => {
          setIsDraggingProduct(false);
          const cartIcon = document.getElementById('cart-icon');
          if (cartIcon) {
            const rect = cartIcon.getBoundingClientRect();
            const isOverCart = (
               info.point.x >= rect.left && 
               info.point.x <= rect.right && 
               info.point.y >= rect.top && 
               info.point.y <= rect.bottom
            );
            if (isOverCart) {
              addToCart(product.id, 1);
            }
          }
        }}
        className="absolute top-6 right-6 z-30 w-10 h-10 bg-black/5 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-900 shadow-lg"
      >
        <Plus className="w-5 h-5" />
      </motion.div>

      {/* Hover Interaction Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-8 pointer-events-none"
      >
          <motion.div 
            variants={contentVariants}
            className="w-full flex flex-col items-center gap-4"
          >
            <motion.h4 variants={itemVariants} className="text-white text-base font-medium tracking-tight serif italic text-center drop-shadow-md">
              {product.name}
            </motion.h4>
            
            <motion.div variants={itemVariants} className="text-brand-gold text-2xl font-light tracking-tighter mb-2">
              {formatPrice(product.price)}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 pointer-events-auto">
              {onQuickView && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-neutral-900 hover:bg-brand-accent hover:text-white transition-all shadow-xl active:scale-95 group/icon"
                  title={lang === 'BN' ? 'কুইক ভিউ' : 'Quick View'}
                >
                  <Search className="w-4 h-4 group-hover/icon:scale-110 transition-transform" />
                </button>
              )}

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 group/icon",
                  isFavorited 
                    ? "bg-red-500 text-white" 
                    : "bg-white/95 backdrop-blur-md text-neutral-900 hover:bg-red-50 hover:text-red-500"
                )}
                title={isFavorited ? (lang === 'BN' ? 'উইশলিস্ট থেকে সরান' : 'Remove from Wishlist') : (lang === 'BN' ? 'উইশলিস্টে যোগ করুন' : 'Add to Wishlist')}
              >
                <Heart className={cn("w-5 h-5 group-hover/icon:scale-110 transition-transform", isFavorited && "fill-current")} />
              </button>

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(e);
                }}
                className={cn(
                   "px-6 h-12 rounded-full flex items-center gap-2 text-white transition-all shadow-xl text-[9px] font-bold uppercase tracking-widest active:scale-95 group/btn relative overflow-hidden",
                   isAdded ? "bg-green-600" : "bg-brand-accent hover:scale-105"
                )}
              >
                 <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div 
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{lang === 'BN' ? 'যোগ হয়েছে' : 'Added'}</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="buy"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        <span>{t('buyNow')}</span>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </button>
            </motion.div>
          </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
