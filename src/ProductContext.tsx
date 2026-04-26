import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Product, Review } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, REVIEWS as INITIAL_REVIEWS } from './constants';

interface ProductContextType {
  products: Product[];
  reviews: Review[];
  loading: boolean;
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [loading, setLoading] = useState(true);

  const addReview = async (newReview: Omit<Review, 'id' | 'date' | 'verified'>) => {
    const review: Review = {
      ...newReview,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      verified: true 
    };
    
    setReviews(prev => [review, ...prev]);
    
    // Optional: Sync to Supabase if table exists
    try {
       await supabase.from('reviews').insert([review]);
    } catch (e) {
       console.log("Supabase reviews table might not exist, keeping local state only");
    }
  };

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
    <ProductContext.Provider value={{ products, reviews, loading, addReview }}>
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
