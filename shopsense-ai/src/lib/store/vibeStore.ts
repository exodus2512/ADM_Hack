import { create } from 'zustand';
import { VibeMode } from '@/types/user';

interface VibeStore {
  selectedVibe: VibeMode;
  setVibe: (vibe: VibeMode) => void;
}

export const useVibeStore = create<VibeStore>((set) => ({
  selectedVibe: 'casual',
  setVibe: (vibe) => set({ selectedVibe: vibe }),
}));
