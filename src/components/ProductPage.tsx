import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../ProductContext';
import { formatPrice, cn } from '../lib/utils';
import { useState } from 'react';
import { Star, Truck, ShieldCheck, RefreshCw, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from './ProductCard';
import { useCart } from '../CartContext';

export default function ProductPage() {
  const { slug } = useParams();
  const { products, loading: productsLoading } = useProducts();
  
  // Ultra-robust matching: ignore spaces, hyphens and case for maximum compatibility
  const product = products.find(p => {
    const normalize = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalize(p.slug) === normalize(slug || '');
  });

  const [activeTab, setActiveTab] = useState<'details' | 'personalize'>('details');
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedVariantData, setSelectedVariantData] = useState<any>(null);
  const { addToCart, setIsDraggingProduct } = useCart();

  if (productsLoading) return <div className="pt-32 text-center h-screen bg-brand-bg text-neutral-900 uppercase tracking-widest text-[10px] font-bold">Curating masterpieces...</div>;
  if (!product) return <div className="pt-32 text-center h-screen bg-brand-bg text-neutral-900">Product not found.</div>;

  const handleVariantSelect = (variantId: string, variantData: any) => {
    setSelectedVariant(variantId);
    setSelectedVariantData(variantData);
    if (variantData.image) {
      // Find index if it already exists in images
      const imgIdx = product.images.indexOf(variantData.image);
      if (imgIdx !== -1) {
        setActiveImage(imgIdx);
      }
    }
  };

  const currentDisplayImage = selectedVariantData?.image || product.images[activeImage];
  const upsellProducts = products.filter(p => product.upsellIds?.includes(p.id));

  return (
    <div className="pt-24 pb-24 bg-brand-bg text-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.3em] text-neutral-300 mb-12">
          <Link to="/" className="hover:text-brand-accent transition-colors">Home</Link>
          <ArrowRight className="w-3 h-3" />
          <Link to="/" className="hover:text-brand-accent transition-colors">{product.category}</Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-neutral-900/60">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Gallery - Personalization Preview Side */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col-reverse md:flex-row gap-6">
              <div className="flex md:flex-col gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => {
                        setActiveImage(i);
                        setSelectedVariantData(null); // Clear variant override when picking general gallery images
                    }}
                    className={cn(
                      "w-20 aspect-square rounded-xl overflow-hidden border transition-all",
                      (activeImage === i && !selectedVariantData?.image) ? "border-brand-accent scale-105 shadow-md" : "border-neutral-100 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
              <div className="flex-1 aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-brand-surface shadow-2xl border border-neutral-100 relative group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentDisplayImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    src={currentDisplayImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {/* Visual Label for Studio Mode */}
                <div className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-md border border-neutral-100 rounded-full flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-900">Live Preview</span>
                </div>

                {/* Draggable handle for main image */}
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
                              addToCart(product.id, quantity, selectedVariant || undefined);
                          }
                      }
                  }}
                  className="absolute bottom-10 right-10 z-20 w-16 h-16 bg-neutral-900 text-white rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl border border-white/20 active:scale-110 transition-all hover:bg-brand-accent group/drag"
                  whileHover={{ scale: 1.05 }}
                >
                  <ShoppingBag className="w-5 h-5 mb-1" />
                  <span className="text-[6px] font-bold uppercase tracking-widest opacity-60 group-hover/drag:opacity-100 italic serif">Drag</span>
                </motion.div>

                {/* Badges Overlay */}
                <div className="absolute bottom-10 left-10 flex flex-col gap-3">
                  {product.badges.map(b => (
                    <span key={b} className="text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-2 bg-neutral-900 text-white rounded-full self-start shadow-xl">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Design Note */}
            <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-3xl">
              <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-[0.3em] mb-3">Artisan Note</p>
              <p className="text-sm font-light text-neutral-500 italic leading-relaxed">
                "Every artifact is unique. Minor variations in texture and hue are a testament to the handcrafted nature of the {product.name}."
              </p>
            </div>
          </div>

          {/* Info & Personalization Studio Side */}
          <div className="flex flex-col bg-white p-10 md:p-14 rounded-[2.5rem] border border-neutral-100 self-start shadow-xl relative overflow-hidden">
            {/* Studio Header Tabs */}
            <div className="flex gap-10 border-b border-neutral-100 mb-10 pb-4">
              <button 
                onClick={() => setActiveTab('details')}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative",
                  activeTab === 'details' ? "text-neutral-900" : "text-neutral-300 hover:text-neutral-500"
                )}
              >
                Information
                {activeTab === 'details' && <motion.div layoutId="tab-underline" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-brand-accent" />}
              </button>
              <button 
                onClick={() => setActiveTab('personalize')}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative flex items-center gap-2",
                  activeTab === 'personalize' ? "text-neutral-900" : "text-neutral-300 hover:text-neutral-500"
                )}
              >
                Personalization Studio
                {activeTab === 'personalize' && <motion.div layoutId="tab-underline" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-brand-accent" />}
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'details' ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-4xl md:text-5xl font-light text-neutral-900 tracking-tighter leading-tight mb-4 serif italic">{product.name}</h1>
                  <div className="flex items-center gap-6 mb-8 pt-4">
                    <p className="text-3xl font-light text-brand-accent tracking-tight">{formatPrice(product.price)}</p>
                    <div className="flex items-center gap-2 h-full border-l border-neutral-100 pl-6">
                      <div className="flex text-brand-accent">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">(24 Premium Reviews)</span>
                    </div>
                  </div>
                  <p className="text-neutral-600 font-light leading-relaxed mb-10 text-sm">{product.description}</p>
                  
                  <div className="bg-brand-surface p-8 rounded-2xl border border-neutral-100 mb-10">
                    <h4 className="text-[10px] font-bold uppercase tracking-[.25em] text-neutral-300 mb-5">Technical Specifications</h4>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      <div>Material: Premium Artisan</div>
                      <div>Weight: 2.5kg</div>
                      <div>Origin: Handcrafted</div>
                      <div>Warranty: 2 Years</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="personalize"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-10">
                    <h1 className="text-3xl font-light text-neutral-900 tracking-tighter serif italic mb-2">Configure Your Piece</h1>
                    <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">Select your desired finishes and options below.</p>
                  </div>

                  {/* Variants */}
                  <div className="space-y-10 mb-12">
                    {product.variants?.map((v) => (
                      <div key={v.type}>
                        <h4 className="text-[10px] font-bold uppercase tracking-[.25em] text-neutral-300 mb-5">{v.type} Selection</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {v.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => handleVariantSelect(opt.id, opt)}
                              className={cn(
                                "flex flex-col gap-2 p-5 rounded-2xl text-[10px] font-bold uppercase tracking-[.15em] border transition-all text-left group",
                                selectedVariant === opt.id 
                                  ? "bg-neutral-900 text-white border-neutral-900 shadow-xl" 
                                  : "bg-white text-neutral-900 border-neutral-100 hover:border-neutral-300 shadow-sm"
                              )}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span>{opt.name}</span>
                                {selectedVariant === opt.id && <ShieldCheck className="w-4 h-4 text-brand-accent" />}
                              </div>
                              <span className={cn(
                                "text-[8px] tracking-[.2em]",
                                selectedVariant === opt.id ? "text-brand-accent" : "text-neutral-400"
                              )}>
                                {opt.priceModifier === 0 ? "Included" : `+${formatPrice(opt.priceModifier)}`}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {!product.variants && (
                        <div className="p-10 border border-dashed border-neutral-100 rounded-3xl text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">No additional variants available for this masterpiece.</p>
                        </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Global Actions - Always Visible */}
            <div className="mt-auto border-t border-neutral-100 pt-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-8 px-8 py-4 rounded-full border border-neutral-100 bg-neutral-50 shadow-inner">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-brand-accent transition-colors"><Minus className="w-4 h-4 text-neutral-900" /></button>
                    <span className="w-4 text-center font-bold text-sm tracking-widest text-neutral-900">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="hover:text-brand-accent transition-colors"><Plus className="w-4 h-4 text-neutral-900" /></button>
                  </div>
                  <button 
                    onClick={(e) => addToCart(product.id, quantity, selectedVariant || undefined, e)}
                    className="flex-1 py-5 bg-neutral-900 text-white font-bold uppercase text-[10px] tracking-[.3em] rounded-full flex items-center justify-center gap-3 hover:bg-brand-accent transition-all duration-500 shadow-xl group"
                  >
                    <ShoppingBag className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
                    Finalize & Add to Bag
                  </button>
                </div>
                <div className="flex justify-between items-center px-4">
                  <div className="flex items-center gap-4 group/item">
                    <Truck className="w-4 h-4 text-brand-accent" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-300">White Glove Delivery Available</span>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-[.4em] text-neutral-400">
                    {product.stock > 0 ? `Stock: ${product.stock} units` : 'Exclusive Pre-order'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligent Upselling */}
        {upsellProducts.length > 0 && (
          <section className="mb-24 px-6 pt-12 border-t border-neutral-100">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-[10px] font-bold tracking-[.43em] uppercase text-brand-accent mb-4 block">Handselected Additions</span>
                <h2 className="text-4xl font-light text-neutral-900 tracking-tighter serif italic">Frequently Bought Together</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
              {upsellProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* User Reviews Section */}
        <section className="mb-24 px-6 pt-12 border-t border-neutral-100">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
              <div>
                <span className="text-[10px] font-bold tracking-[.43em] uppercase text-brand-accent mb-4 block">Customer Voices</span>
                <h2 className="text-4xl md:text-5xl font-light text-neutral-900 tracking-tighter serif italic text-balance">The Nexa Experience</h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex text-brand-accent gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">4.9 Average Based on 128 Reviews</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { name: "Sophia Martinez", rating: 5, date: "Mar 15, 2024", comment: "The attention to detail is breathtaking. The finish on this piece is unlike anything I've seen in retail stores. Truly artisan quality." },
                { name: "James Wilson", rating: 5, date: "Mar 10, 2024", comment: "Fast shipping to London and excellent customer support. The packaging itself was a work of art. Highly recommended for luxury decor." },
                { name: "Elena Rossi", rating: 5, date: "Feb 22, 2024", comment: "Fits perfectly in my minimalist living room. The warm glow it provides is exactly what I was looking for. A masterpiece." },
                { name: "Marcus Thorne", rating: 4, date: "Feb 05, 2024", comment: "Exquisite design. One minor scratch on delivery but the support team replaced it within 48 hours without any hassle. Amazing service." },
                { name: "Aria Vance", rating: 5, date: "Jan 28, 2024", comment: "Buying lighting online is always a risk, but Nexa made it seamless. The live preview was accurate and the real product exceeds expectations." }
              ].map((review, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-900">{review.name}</span>
                      <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">{review.date}</span>
                    </div>
                    <div className="flex text-brand-accent gap-0.5">
                      {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-sm font-light text-neutral-500 italic leading-relaxed group-hover:text-neutral-700 transition-colors">
                    "{review.comment}"
                  </p>
                  <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-300">Verified Collector</span>
                  </div>
                </motion.div>
              ))}
              
              {/* Write a Review Teaser */}
              <div className="bg-brand-surface p-10 rounded-[2rem] border border-dashed border-neutral-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-brand-accent transition-all">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors shadow-sm">
                  <Star className="w-5 h-5" />
                </div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-900 mb-2">Share Your Experience</h4>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-6">Join our verified collectors community</p>
                <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent border-b border-brand-accent/20 pb-1 group-hover:border-brand-accent transition-all">Write Review</button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
