import { create } from 'zustand';
import { Product } from '@/types/product';

interface WishlistStore {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  toggle: (product) =>
    set((state) =>
      state.items.find((p) => p.id === product.id)
        ? { items: state.items.filter((p) => p.id !== product.id) }
        : { items: [...state.items, product] }
    ),
  isWishlisted: (id) => get().items.some((p) => p.id === id),
}));
