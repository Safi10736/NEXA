import React, { useEffect, useRef } from 'react';
import { useProducts } from '../ProductContext';
import { useNotifications } from '../NotificationContext';
import { useLanguage } from '../LanguageContext';
import { formatPrice } from '../lib/utils';

export default function PriceDropMonitor() {
  const { products } = useProducts();
  const { addNotification } = useNotifications();
  const { lang } = useLanguage();
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Check every 30 seconds for a "price drop" simulation
    const interval = setInterval(() => {
      const viewedIds = JSON.parse(localStorage.getItem('viewed_products') || '[]');
      if (viewedIds.length === 0) return;

      const viewedProducts = products.filter(p => viewedIds.includes(p.id));
      
      // Select a random product to "drop price" if it's not already notified
      const candidates = viewedProducts.filter(p => !notifiedRef.current.has(p.id));
      
      if (candidates.length > 0) {
        const product = candidates[Math.floor(Math.random() * candidates.length)];
        
        // Simulate a 15% drop
        const oldPrice = product.price;
        const newPrice = Math.floor(product.price * 0.85);

        addNotification({
          type: 'price-drop',
          title: lang === 'BN' ? 'দাম কমেছে!' : 'Price Drop Alert!',
          message: lang === 'BN' 
            ? `${product.name}-এর দাম ${formatPrice(oldPrice)} থেকে কমে এখন ${formatPrice(newPrice)}!` 
            : `${product.name} is now ${formatPrice(newPrice)} (was ${formatPrice(oldPrice)})!`,
          duration: 8000
        });

        notifiedRef.current.add(product.id);
      }
    }, 45000); // 45 seconds to not be too annoying but visible in demo

    return () => clearInterval(interval);
  }, [products, addNotification, lang]);

  return null;
}
