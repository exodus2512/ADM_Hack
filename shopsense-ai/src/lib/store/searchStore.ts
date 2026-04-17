import { create } from 'zustand';
import { Product } from '@/types/product';

type Intent = 'browsing' | 'buying';

interface SearchStore {
  query: string;
  intent: Intent;
  results: Product[];
  filters: Record<string, string[]>;
  setQuery: (q: string) => void;
  setIntent: (i: Intent) => void;
  setResults: (r: Product[]) => void;
  setFilters: (f: Record<string, string[]>) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  intent: 'browsing',
  results: [],
  filters: {},
  setQuery: (query) => set({ query }),
  setIntent: (intent) => set({ intent }),
  setResults: (results) => set({ results }),
  setFilters: (filters) => set({ filters }),
  reset: () => set({ query: '', intent: 'browsing', results: [], filters: {} }),
}));
