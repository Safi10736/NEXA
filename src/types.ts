/**
 * Nexa Luxury E-commerce Types
 */

export type Category = 'Table Lamps' | 'Wall Art' | 'Vases' | 'Accessories' | 'Furniture';

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  videos?: string[];
  variants?: {
    type: string;
    options: ProductVariant[];
  }[];
  badges: ('Eco-friendly' | 'New' | 'Pre-order')[];
  upsellIds: string[]; // Frequently bought together
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  priceAtAddition: number;
}
