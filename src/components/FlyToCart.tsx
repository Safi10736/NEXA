import React from 'react';
import { motion } from 'motion/react';
import { useCart } from '../CartContext';

export default function FlyToCartRenderer() {
  const { flyingElements, onFlyEnd } = useCart();

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {flyingElements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ 
            x: el.startX - 32, 
            y: el.startY - 32, 
            scale: 1, 
            opacity: 1 
          }}
          animate={{ 
            x: el.endX - 8, 
            y: el.endY - 8, 
            scale: 0.1, 
            opacity: 0 
          }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          onAnimationComplete={() => onFlyEnd(el.id)}
          className="fixed w-16 h-16 rounded-full overflow-hidden border-2 border-brand-accent shadow-2xl bg-white flex items-center justify-center p-0.5"
        >
          <img src={el.image} className="w-full h-full object-cover rounded-full" alt="" />
        </motion.div>
      ))}
    </div>
  );
}
