import { Product, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aurelia Minimalist Table Lamp',
    slug: 'aurelia-table-lamp',
    description: 'A masterpiece of minimalist design, the Aurelia features a hand-brushed gold base and a matte white ceramic shade. Perfectly balanced for modern living.',
    price: 450,
    category: 'Table Lamps',
    images: [
      'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=800'
    ],
    badges: ['New', 'Eco-friendly'],
    videos: [
      'https://assets.mixkit.co/videos/preview/mixkit-decorating-a-room-with-flowers-and-lamps-42525-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-living-room-and-bedroom-42511-large.mp4'
    ],
    upsellIds: ['2', '4'],
    stock: 12,
    variants: [
      {
        type: 'Finish',
        options: [
          { id: 'v1', name: 'Brushed Gold', value: 'gold', priceModifier: 0, image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800' },
          { id: 'v2', name: 'Matte Black', value: 'black', priceModifier: -20, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Orbital Glass Vase',
    slug: 'orbital-glass-vase',
    description: 'Hand-blown recycled glass with a unique orbital wave pattern. A sculptural piece even without flowers.',
    price: 180,
    category: 'Vases',
    images: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800'],
    badges: ['Eco-friendly'],
    upsellIds: ['1'],
    stock: 5,
    flashSale: {
      endTime: Date.now() + 1000 * 60 * 60 * 24, // 24 hours from now
      salePrice: 145
    },
    variants: [
      {
        type: 'Size',
        options: [
          { id: 'v5', name: 'Grand (40cm)', value: 'large', priceModifier: 0, image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800' },
          { id: 'v6', name: 'Petite (25cm)', value: 'small', priceModifier: -40, image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Ecliptic Wall Sculpture',
    slug: 'ecliptic-wall-sculpture',
    description: 'A triptych of hammered brass discs that play with light and shadow throughout the day.',
    price: 890,
    category: 'Wall Art',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'],
    badges: ['Pre-order'],
    upsellIds: ['1', '5'],
    stock: 0
  },
  {
    id: '4',
    name: 'LED Filament Bulb - Warm Amber',
    slug: 'warm-amber-led-bulb',
    description: 'Energy-efficient LED bulb designed specifically for the Aurelia series. 2200K warm glow.',
    price: 25,
    category: 'Table Lamps',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'],
    badges: ['Eco-friendly'],
    upsellIds: [],
    stock: 100
  },
  {
    id: '5',
    name: 'Zenith Porcelain Bowl',
    slug: 'zenith-porcelain-bowl',
    description: 'Ultra-thin porcelain with a gold leaf rim. Each piece is unique.',
    price: 220,
    category: 'Vases',
    images: ['https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800'],
    badges: ['New'],
    upsellIds: ['3'],
    stock: 8
  },
  {
    id: '6',
    name: 'Velvet Accent Chair',
    slug: 'velvet-accent-chair',
    description: 'A plush velvet chair with tapered gold legs. Ergonomically designed for both comfort and aesthetic appeal.',
    price: 1250,
    category: 'Furniture',
    images: ['https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800'],
    badges: ['New'],
    upsellIds: ['1', '3'],
    stock: 4,
    variants: [
      {
        type: 'Fabric',
        options: [
          { id: 'v3', name: 'Emerald Velvet', value: 'emerald', priceModifier: 0, image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800' },
          { id: 'v4', name: 'Royal Blue', value: 'blue', priceModifier: 50, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' }
        ]
      }
    ]
  },
  {
    id: '7',
    name: 'Marble & Brass Coaster Set',
    slug: 'marble-brass-coasters',
    description: 'Set of 4 hand-polished marble coasters with integrated brass inlay. Protect your surfaces in style.',
    price: 85,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80&w=800'],
    badges: ['Eco-friendly'],
    upsellIds: ['2', '5'],
    stock: 45
  },
  {
    id: '8',
    name: 'Abstract Marble Sculpture',
    slug: 'abstract-marble-sculpture',
    description: 'A fluid, abstract form carved from a single block of Carrara marble. A true statement piece.',
    price: 1540,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800'],
    badges: ['Pre-order'],
    upsellIds: ['3'],
    stock: 1
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    userName: 'Sophia Martinez',
    rating: 5,
    comment: 'The Aurelia lamp is even more beautiful in person. The gold finish is subtle and expensive-looking.',
    verified: true,
    date: '2024-03-15'
  },
  {
    id: 'r2',
    userName: 'James Wilson',
    rating: 5,
    comment: 'Fast shipping to London. The Eco-friendly packaging was a very nice touch.',
    verified: true,
    date: '2024-03-10'
  }
];
