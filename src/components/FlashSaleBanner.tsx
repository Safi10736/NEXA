import React from 'react';
import { useProducts } from '../ProductContext';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import FlashSaleTimer from './FlashSaleTimer';

export default function FlashSaleBanner() {
  const { products } = useProducts();
  const { lang } = useLanguage();

  const flashSaleProduct = products.find(p => p.flashSale && p.flashSale.endTime > Date.now());

  if (!flashSaleProduct) return null;

  return (
    <div className="bg-neutral-900 text-white py-3 px-6 overflow-hidden relative group">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-gold fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Flash Sale Active</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <p className="text-xs font-light text-white/80">
            {lang === 'BN' ? (
                <>সীমিত সময়ের জন্য <span className="font-bold text-white">{flashSaleProduct.name}</span> কিনুন বিশেষ মূল্যে!</>
            ) : (
                <>Get the <span className="font-bold text-white">{flashSaleProduct.name}</span> at an exclusive price!</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <FlashSaleTimer endTime={flashSaleProduct.flashSale!.endTime} />
          <Link 
            to={`/product/${flashSaleProduct.slug}`}
            className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest bg-white text-neutral-900 px-6 py-2 rounded-full hover:bg-brand-accent hover:text-white transition-all shadow-xl"
          >
            Claim Offer
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
      
      {/* Decorative background flare */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-brand-accent/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
    </div>
  );
}
