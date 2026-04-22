import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-neutral-100 flex flex-col items-center">
        <motion.div
           initial={{ scale: 0, rotate: -45 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
           className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-10 shadow-lg shadow-green-200"
        >
           <Check className="w-12 h-12" strokeWidth={3} />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl font-light text-neutral-900 tracking-tighter mb-4">
            Thank you for <span className="serif italic">Purchase</span>
          </h1>
          <div className="flex gap-2 justify-center mb-10">
             {[...Array(4)].map((_, i) => (
                <span key={i} className="text-2xl">✅</span>
             ))}
          </div>
          <p className="text-sm text-neutral-500 font-light leading-relaxed mb-12">
            Your order has been received and is being processed for shipping. We've sent a confirmation email to your inbox.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-5 bg-neutral-900 text-white rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-accent transition-all duration-500 group shadow-xl"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </button>
            <button 
              onClick={() => navigate('/track')}
              className="w-full py-5 bg-white border border-neutral-100 text-neutral-900 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:border-brand-accent transition-all duration-500 group"
            >
              Track My Order
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
