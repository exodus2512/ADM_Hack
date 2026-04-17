import { create } from 'zustand';

interface SessionStore {
  clicks: Record<string, number>; // productId -> count
  dwellTimes: Record<string, number>; // productId -> seconds
  logClick: (productId: string) => void;
  logDwell: (productId: string, seconds: number) => void;
  getPreferredCategories: () => string[];
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  clicks: {},
  dwellTimes: {},
  logClick: (id) => set((s) => ({ clicks: { ...s.clicks, [id]: (s.clicks[id] || 0) + 1 } })),
  logDwell: (id, seconds) => set((s) => ({ dwellTimes: { ...s.dwellTimes, [id]: (s.dwellTimes[id] || 0) + seconds } })),
  getPreferredCategories: () => {
    // Stub for preference drift - returning categories based on highest clicks
    return [];
  }
}));
