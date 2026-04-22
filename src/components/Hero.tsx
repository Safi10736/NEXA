import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen bg-neutral-100 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1556912177-859306029846?auto=format&fit=crop&q=80&w=2400"
          alt="Eco Kitchen" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-12 flex items-center">
        <div className="w-full grid lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <div className="flex gap-4 mb-8">
               {['Shop', 'Bestsellers', 'Gallery', 'About'].map(item => (
                 <button key={item} className="text-[10px] font-bold uppercase tracking-widest text-white/90 hover:text-white transition-colors">
                   {item}
                 </button>
               ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-light text-white leading-[1.1] mb-6 tracking-tight">
              Eco-Friendly <br />
              <span className="serif italic">Kitchenware</span> for <br />
              a greener home
            </h1>
            
            <p className="text-white/80 text-sm font-light mb-10 max-w-md leading-relaxed">
              The eco-friendly kitchenware niche with a sense of urgency, much like the original banner. Let me know if you'd like adjustments!
            </p>
            
            <button className="group px-8 py-3 bg-white text-neutral-900 rounded-full flex items-center gap-3 hover:bg-brand-accent hover:text-white transition-all duration-500 font-bold uppercase text-[9px] tracking-widest shadow-xl">
              Shop now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <div className="hidden lg:flex justify-end items-end pb-12">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-white w-48 shadow-2xl"
             >
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                      <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">Natural. Sustainable.</span>
                   </div>
                   <p className="text-[7px] font-bold uppercase tracking-widest mb-4">Eco-conscious.</p>
                   <span className="text-5xl font-light tracking-tighter serif italic">96%</span>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
