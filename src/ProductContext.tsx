import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Product } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';

interface ProductContextType {
  products: Product[];
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to live products from Supabase
    const fetchProducts = async () => {
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error("Product Context Error:", error);
        setLoading(false);
        return;
      }

      // Merge logic: DB products override Initial products if slugs match
      const combined = [...(dbProducts as Product[])];
      
      INITIAL_PRODUCTS.forEach(p => {
        const alreadyExists = combined.find(cp => cp.slug === p.slug || cp.id === p.id);
        if (!alreadyExists) {
          combined.push(p);
        }
      });

      setProducts(combined);
      setLoading(false);
    };

    fetchProducts();

    // Real-time subscription
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
