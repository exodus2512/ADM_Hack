// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviewCount: number;
  badges: AiBadge[];
  isWishlisted?: boolean;
  stock: number;
  description: string;
  tags: string[];
}

export type AiBadge =
  | 'trending-in-size'
  | 'matches-style'
  | 'price-dropped'
  | 'low-stock';

export interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  date: string;
  verified: boolean;
}

export interface ReviewSummary {
  summary: string;
  score: number;
  positives: string[];
  negatives: string[];
  sentimentBar: number; // 0-100
}
