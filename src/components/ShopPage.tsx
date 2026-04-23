import React, { useState } from 'react';
import { useProducts } from '../ProductContext';
import ProductCard from './ProductCard';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../LanguageContext';

export default function ShopPage() {
  const { products, loading } = useProducts();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('backToHome')}
            </Link>
            <h1 className="text-5xl font-light text-neutral-900 tracking-tighter">
              The <span className="serif italic text-brand-accent">{t('collection')}</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-brand-accent transition-colors" />
              <input 
                type="text"
                placeholder={t('searchProducts')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-white border border-neutral-100 rounded-full py-4 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
              />
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-white border border-neutral-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-900 hover:bg-neutral-50 transition-all">
              <SlidersHorizontal className="w-4 h-4" />
              {t('filterBy')}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-neutral-900 text-white shadow-xl italic' 
                  : 'bg-white text-neutral-400 hover:text-neutral-900 border border-neutral-100'}
              `}
            >
              {cat === 'All' ? t('all') : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-400 animate-pulse">{t('loadingTreasures')}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <p className="text-xl font-light text-neutral-400 mb-4 tracking-tighter">{t('noItemsFound')}</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="text-brand-accent text-[10px] font-bold uppercase tracking-widest border-b border-brand-accent/20 pb-1"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
