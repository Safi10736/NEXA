import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from './types';
import { useProducts } from './ProductContext';

interface FlyingElement {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number, variantId?: string, event?: React.MouseEvent) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
  clearCart: () => void;
  flyingElements: FlyingElement[];
  onFlyEnd: (id: string) => void;
  isDraggingProduct: boolean;
  setIsDraggingProduct: (isDragging: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { products } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [flyingElements, setFlyingElements] = useState<FlyingElement[]>([]);
  const [isDraggingProduct, setIsDraggingProduct] = useState(false);
  
  const cartTotal = cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const onFlyEnd = useCallback((id: string) => {
    setFlyingElements(prev => prev.filter(el => el.id !== id));
  }, []);

  const addToCart = useCallback((productId: string, quantity: number, variantId?: string, event?: React.MouseEvent) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(currentCart => {
      const existingItemIndex = currentCart.findIndex(
        item => item.productId === productId && item.variantId === variantId
      );

      if (existingItemIndex > -1) {
        const newCart = [...currentCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...currentCart, { productId, quantity, variantId, priceAtAddition: product.price }];
    });

    // Fly animation logic
    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const cartIcon = document.getElementById('cart-icon');
      
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        const flyId = Math.random().toString(36).substring(7);
        
        setFlyingElements(prev => [...prev, {
          id: flyId,
          startX: rect.left + rect.width / 2,
          startY: rect.top + rect.height / 2,
          endX: cartRect.left + cartRect.width / 2,
          endY: cartRect.top + cartRect.height / 2,
          image: product.images[0]
        }]);

        // Auto-open sidebar after animation delay
        setTimeout(() => {
          setIsCartOpen(true);
        }, 1200);
      }
    } else {
        // Just open if no event (for quick adds)
        setIsCartOpen(true);
    }
  }, [products]);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart(currentCart => 
      currentCart.filter(item => !(item.productId === productId && item.variantId === variantId))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    setCart(currentCart => {
      const newCart = [...currentCart];
      const index = newCart.findIndex(
        item => item.productId === productId && item.variantId === variantId
      );
      if (index > -1) {
        newCart[index].quantity = Math.max(1, quantity);
      }
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isCartOpen, 
      setIsCartOpen,
      cartTotal,
      cartCount,
      flyingElements,
      onFlyEnd,
      isDraggingProduct,
      setIsDraggingProduct
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
