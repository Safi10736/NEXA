import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Instagram, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GalleryPage() {
  const images = [
    { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', title: 'Minimalist Dining' },
    { url: 'https://images.unsplash.com/photo-1610631880197-484c399c922c?auto=format&fit=crop&q=80&w=800', title: 'Natural Textures' },
    { url: 'https://images.unsplash.com/photo-1544787210-22c66d137f6d?auto=format&fit=crop&q=80&w=800', title: 'Eco-Ceramics' },
    { url: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=800', title: 'Morning Light' },
    { url: 'https://images.unsplash.com/photo-1517089531940-6a9b2488ad02?auto=format&fit=crop&q=80&w=800', title: 'Kitchen Essentials' },
    { url: 'https://images.unsplash.com/photo-1616489953149-8083070be0bc?auto=format&fit=crop&q=80&w=800', title: 'Sustainable Living' },
    { url: 'https://images.unsplash.com/photo-1556912177-859306029846?auto=format&fit=crop&q=80&w=800', title: 'Cozy Moments' },
    { url: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=800', title: 'Artisanal Craft' },
    { url: 'https://images.unsplash.com/photo-1565193298357-3f9fe243f769?auto=format&fit=crop&q=80&w=800', title: 'Wooden Accents' },
  ];

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-brand-accent mb-4">Inspiration Collective</span>
          <h1 className="text-6xl font-light text-neutral-900 tracking-tighter mb-8">
            Curated <span className="serif italic">Moments</span>
          </h1>
          <p className="max-w-lg text-neutral-500 font-light text-sm leading-relaxed">
            A visual journey through sustainable living. Explore how our eco-friendly masterpieces transform everyday spaces into mindful sanctuaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700"
            >
              <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/40 transition-all duration-500 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100">
                <span className="text-white/60 text-[8px] font-bold uppercase tracking-[0.3em] mb-2">{item.title}</span>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-neutral-900">
                   <Heart className="w-5 h-5 fill-current" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 pt-24 border-t border-neutral-100 flex flex-col items-center">
            <Instagram className="w-12 h-12 text-brand-accent mb-8" />
            <p className="text-xl font-light tracking-tighter text-neutral-900 mb-8 serif italic">Follow our sustainable journey</p>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              className="px-12 py-4 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl"
            >
              @NEXA.LIVING
            </a>
        </div>
      </div>
    </div>
  );
}
