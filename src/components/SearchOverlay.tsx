import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, History, ArrowRight, Zap, Package, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../ProductContext';
import { useLanguage } from '../LanguageContext';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  { id: '1', term: 'Moon Lamp', category: 'Lighting' },
  { id: '2', term: 'Geometric Vase', category: 'Decor' },
  { id: '3', term: 'Smart Kettle', category: 'Kitchen' },
  { id: '4', term: 'Eco-friendly Sets', category: 'Essentials' }
];

// Simple fuzzy matching algorithm (Levenshtein Distance)
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { products } = useProducts();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setSuggestion(null);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Exact & partial matches
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    setResults(filtered);

    // Typo Correction Logic
    if (filtered.length === 0 && query.length > 2) {
      let closestMatch: string | null = null;
      let minDistance = 3; // Max distance for typo correction

      const searchTargets = Array.from(new Set([
        ...products.map(p => p.name),
        ...products.map(p => p.category),
        ...TRENDING_SEARCHES.map(t => t.term)
      ]));

      for (const target of searchTargets) {
        const words = target.split(' ');
        for (const word of words) {
            const distance = getLevenshteinDistance(lowerQuery, word.toLowerCase());
            if (distance < minDistance) {
              minDistance = distance;
              closestMatch = target;
            }
        }
      }
      setSuggestion(closestMatch);
    } else {
      setSuggestion(null);
    }
  }, [query, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // For now, search just takes you to shop with a search param or similar
      // Or we can just close and navigate
      onClose();
      navigate(`/shop?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-brand-bg/80 backdrop-blur-2xl dark:bg-black/90"
        >
          {/* Header */}
          <div className="px-6 py-8 md:px-12 md:py-12 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
               <form onSubmit={handleSearch} className="flex-1 relative group">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-neutral-400 group-focus-within:text-brand-accent transition-all duration-500 scale-1" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={lang === 'BN' ? 'আধুনিক পণ্য খুঁজুন...' : 'Search futuristic essentials...'}
                    className="w-full pl-14 pr-4 py-4 bg-transparent text-3xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-white border-none outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
                  />
                  <AnimatePresence>
                    {query && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setQuery('')}
                        type="button"
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-neutral-100 dark:bg-white/10 rounded-full hover:scale-110 transition-transform"
                      >
                        <X className="w-5 h-5 text-neutral-400" />
                      </motion.button>
                    )}
                  </AnimatePresence>
               </form>

               <button 
                 onClick={onClose}
                 className="hidden md:flex items-center gap-4 px-8 py-4 bg-white/10 dark:bg-black/40 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-xl text-neutral-900 dark:text-white"
               >
                 {lang === 'BN' ? 'বন্ধ করুন' : 'Close'} [ESC]
               </button>
               <button 
                 onClick={onClose}
                 className="md:hidden p-3 bg-neutral-100 dark:bg-white/10 rounded-full"
               >
                 <X className="w-8 h-8 text-neutral-900 dark:text-white" />
               </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto px-6 py-12 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Left Column: Suggestions & Trending */}
              <div className="lg:col-span-4 space-y-16">
                {/* Typo Correction */}
                <AnimatePresence>
                  {suggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-8 bg-brand-accent/5 dark:bg-brand-accent/10 border border-brand-accent/20 dark:border-brand-accent/10 rounded-[3rem] backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-3 text-brand-accent mb-3">
                        <Zap className="w-5 h-5 fill-current animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Did you mean?</span>
                      </div>
                      <button 
                        onClick={() => setQuery(suggestion)}
                        className="text-2xl font-light text-neutral-900 dark:text-white hover:text-brand-accent transition-colors serif italic"
                      >
                        {suggestion}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-neutral-400 dark:text-neutral-600">
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">{lang === 'BN' ? 'ট্রেন্ডিং সার্চ' : 'Trending Now'}</h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {TRENDING_SEARCHES.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setQuery(item.term)}
                        className="px-8 py-4 bg-white/5 dark:bg-black/20 border border-neutral-100 dark:border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:border-brand-accent hover:text-brand-accent dark:hover:text-brand-accent transition-all shadow-sm active:scale-95 backdrop-blur-sm"
                      >
                        {item.term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-neutral-400 dark:text-neutral-600">
                    <History className="w-5 h-5" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">{lang === 'BN' ? 'বিভাগ অনুসারে' : 'Explore Categories'}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {['Lighting', 'Decor', 'Kitchen', 'Essentials'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          onClose();
                          navigate(`/shop?category=${cat}`);
                        }}
                        className="flex items-center justify-between group p-6 rounded-[2rem] bg-white/5 dark:bg-black/20 hover:bg-white dark:hover:bg-brand-accent/20 transition-all text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white border border-transparent hover:border-neutral-100 dark:hover:border-white/20"
                      >
                        {cat}
                        <ArrowRight className="w-5 h-5 text-neutral-200 dark:text-neutral-800 group-hover:text-brand-accent group-hover:translate-x-2 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Search Results */}
              <div className="lg:col-span-8">
                {query.length > 0 ? (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 dark:text-neutral-600">
                        {lang === 'BN' ? 'সার্চ ফলাফল' : 'Product Results'} ({results.length})
                      </h3>
                      {results.length > 0 && (
                        <Link 
                          to={`/shop?q=${query}`}
                          onClick={onClose}
                          className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent hover:underline decoration-brand-accent/20 underline-offset-8"
                        >
                          View All
                        </Link>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {results.map((product, idx) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05, duration: 0.5 }}
                        >
                          <Link
                            to={`/product/${product.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-8 p-6 rounded-[3rem] bg-white dark:bg-black/40 border border-neutral-100 dark:border-white/5 hover:border-brand-accent/30 transition-all group shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-sm"
                          >
                            <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-white/5">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            </div>
                            <div className="flex-1">
                              <div className="inline-block px-3 py-1 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full mb-3">
                                <span className="text-[8px] font-black uppercase tracking-widest text-brand-accent">{product.category}</span>
                              </div>
                              <h4 className="text-2xl font-light text-neutral-900 dark:text-white mb-2 serif italic leading-none">{product.name}</h4>
                              <p className="text-lg font-bold text-neutral-900 dark:text-brand-gold">{formatPrice(product.price)}</p>
                            </div>
                            <div className="p-5 rounded-full bg-neutral-50 dark:bg-white/5 text-neutral-400 dark:text-neutral-600 group-hover:bg-brand-accent group-hover:text-white transition-all shadow-inner">
                              <ArrowRight className="w-6 h-6" />
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                      
                      {results.length === 0 && !suggestion && (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                          <div className="w-24 h-24 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center mb-8 shadow-inner">
                            <Package className="w-10 h-10 text-neutral-200 dark:text-neutral-800" />
                          </div>
                          <h4 className="text-3xl font-light text-neutral-900 dark:text-white mb-3 tracking-tighter serif italic">No items matched "{query}"</h4>
                          <p className="text-neutral-400 dark:text-neutral-600 max-w-xs mx-auto text-sm leading-relaxed">Consider rephrasing your search or explore our curated collections.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center opacity-40 py-32">
                    <Search className="w-20 h-20 mb-10 text-neutral-200 dark:text-neutral-800 animate-pulse" />
                    <p className="text-3xl font-light serif italic tracking-tighter text-neutral-900 dark:text-white leading-tight">Explore the intersection of<br /><span className="text-brand-accent">design and sustainability</span></p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
