import React from 'react';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { ShoppingBag, Eye, Heart, Plus, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { useLanguage } from '../LanguageContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { addToCart, setIsDraggingProduct } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

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
      className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 transition-all duration-700 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-surface">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {/* Draggable Handle */}
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

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] rounded-full backdrop-blur-md border border-white/50 text-neutral-600 bg-white/40 shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Hover Animation Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end p-10 pointer-events-none"
        >
            <motion.div 
              variants={contentVariants}
              className="w-full flex flex-col items-center gap-4"
            >
              <motion.h4 variants={itemVariants} className="text-white text-base font-medium tracking-tight serif italic text-center drop-shadow-md">
                {product.name}
              </motion.h4>
              
              <motion.div variants={itemVariants} className="text-brand-gold text-3xl font-light tracking-tighter mb-4">
                {formatPrice(product.price)}
              </motion.div>

              <motion.div variants={itemVariants} className="flex gap-4 pointer-events-auto">
                <Link 
                  to={`/product/${product.slug}`}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-neutral-900 hover:bg-brand-accent hover:text-white transition-all shadow-2xl active:scale-95"
                  title={lang === 'BN' ? 'বিস্তারিত দেখুন' : 'View Details'}
                >
                  <Eye className="w-6 h-6" />
                </Link>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id);
                  }}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-95",
                    isFavorited 
                      ? "bg-red-500 text-white" 
                      : "bg-white text-neutral-900 hover:bg-red-50 hover:text-red-500"
                  )}
                  title={isFavorited ? (lang === 'BN' ? 'উইশলিস্ট থেকে সরান' : 'Remove from Wishlist') : (lang === 'BN' ? 'উইশলিস্টে যোগ করুন' : 'Add to Wishlist')}
                >
                  <Heart className={cn("w-6 h-6", isFavorited && "fill-current")} />
                </button>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product.id, 1, undefined, e);
                    navigate('/checkout');
                  }}
                  className="px-8 h-14 bg-brand-accent rounded-full flex items-center gap-3 text-white hover:bg-neutral-900 transition-all shadow-2xl text-[10px] font-bold uppercase tracking-widest active:scale-95 group/btn"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  {t('buyNow')}
                </button>
              </motion.div>
            </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
