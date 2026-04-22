import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, ShieldCheck, Heart, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-32">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-brand-accent mb-4">Our Philosophy</span>
          <h1 className="text-6xl md:text-8xl font-light text-neutral-900 tracking-tighter mb-12">
            Mindful <span className="serif italic">Living</span>,<br />
            Timeless Design
          </h1>
          <p className="max-w-2xl text-neutral-600 font-light text-lg leading-relaxed">
            At NEXA, we believe that luxury shouldn't cost the Earth. We curate handcrafted masterpieces that balance aesthetic excellence with environmental integrity.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-24 mb-32 items-center">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1556912177-859306029846?auto=format&fit=crop&q=80&w=1200" 
               className="w-full h-full object-cover"
               alt="Craftsmanship"
             />
             <div className="absolute inset-0 bg-neutral-900/10" />
          </div>
          <div className="space-y-12">
             <div className="space-y-4">
                <h3 className="text-3xl font-light tracking-tighter serif italic text-brand-accent">Beyond Products</h3>
                <p className="text-neutral-500 leading-relaxed font-light">
                  Nexa was born from a simple observation: the world is beautiful, and we should keep it that way. Every item in our collection is selected based on three criteria: its beauty, its longevity, and its impact on the planet.
                </p>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-accent">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">100% Eco-Friendly</h4>
                  <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-tighter">Sustainably sourced materials only.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-accent">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Ethical Sourcing</h4>
                  <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-tighter">Fair pay and conditions for all artisans.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-accent">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Carbon Neutral</h4>
                  <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-tighter">Offsets for every single delivery.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-accent">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Artisan Support</h4>
                  <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-tighter">Preserving traditional craft techniques.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-[3rem] p-16 md:p-32 text-center text-white">
           <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-12 leading-tight">
             Join the <span className="serif italic text-brand-accent">Movement</span> for a <br />
             greener lifestyle.
           </h2>
           <Link 
            to="/shop"
            className="px-12 py-5 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform inline-block shadow-2xl"
           >
             Start Shopping
           </Link>
        </div>
      </div>
    </div>
  );
}
