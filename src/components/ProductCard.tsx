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
  const { addToCart } = useCart();
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
    initial: { y: 0 },
    hover: { y: -8 }
  };

  const contentVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { 
        duration: 0.4, 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    initial: { y: 10, opacity: 0 },
    hover: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={containerVariants}
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-700 luxury-shadow border border-neutral-100 hover:border-brand-gold/30"
    >
      {/* Wishlist Button - Fixed Top Right */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={cn(
          "absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/80 backdrop-blur-md shadow-sm border border-neutral-100/50 hover:scale-110",
          isFavorited ? "text-brand-gold" : "text-neutral-300 hover:text-brand-gold"
        )}
      >
        <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
      </button>

      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-neutral-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* AR Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-gold/90 text-white rounded-sm text-[8px] display tracking-widest shadow-sm backdrop-blur-sm">
            <Smartphone className="w-3 h-3" />
            AR
          </div>
        </div>

        {/* Hover Overlay Desktop */}
        <motion.div 
          className="absolute inset-0 bg-brand-accent/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex flex-col items-center justify-center p-8 pointer-events-none"
        >
            <motion.div 
              variants={contentVariants}
              className="flex gap-3 pointer-events-auto"
            >
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView?.(product);
                }}
                className="w-12 h-12 bg-white text-brand-accent rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-white transition-all shadow-xl"
              >
                <Search className="w-4 h-4" />
              </button>
              <button 
                onClick={handleAddToCart}
                className="w-12 h-12 bg-white text-brand-accent rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-white transition-all shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </motion.div>
        </motion.div>
      </Link>

      <div className="p-6 md:p-8 text-center bg-white">
        <div className="mb-2">
          <div className="flex justify-center mb-4">
             <div className="h-4 w-px bg-brand-gold/30" />
          </div>
          <span className="text-[9px] display tracking-[0.3em] text-neutral-400 uppercase">{product.category || 'Luxury Jewelry'}</span>
        </div>
        <h3 className="text-xl serif text-brand-accent mb-4 truncate group-hover:text-brand-gold transition-colors">{product.name}</h3>
        <div className="text-brand-gold text-lg serif mb-6">
          {formatPrice(product.price)}
        </div>
        
        {/* Refined Quick Action Button - Visible on Mobile and Desktop */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={cn(
            "w-full py-4 text-[10px] display tracking-[0.2em] transition-all relative overflow-hidden group/btn",
            isAdded ? "bg-green-50 text-green-600" : "bg-neutral-50 text-neutral-400 hover:bg-brand-accent hover:text-white"
          )}
        >
          <span className="relative z-10">
            {isAdded ? (lang === 'BN' ? 'ADDED' : 'ADDED') : (lang === 'BN' ? 'PURCHASE' : 'PURCHASE')}
          </span>
          <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
