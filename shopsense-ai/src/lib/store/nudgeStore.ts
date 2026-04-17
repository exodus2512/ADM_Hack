import { create } from 'zustand';

type NudgeType = 'low-stock' | 'price-drop' | 'delivery-threshold' | null;

interface NudgeStore {
  currentNudge: { type: NudgeType; message: string } | null;
  shownNudges: NudgeType[];
  showNudge: (type: NudgeType, message: string) => void;
  dismissNudge: () => void;
  canShow: (type: NudgeType) => boolean;
}

export const useNudgeStore = create<NudgeStore>((set, get) => ({
  currentNudge: null,
  shownNudges: [],
  showNudge: (type, message) => {
    if (get().canShow(type)) {
      set((s) => ({
        currentNudge: { type, message },
        shownNudges: [...s.shownNudges, type],
      }));
    }
  },
  dismissNudge: () => set({ currentNudge: null }),
  canShow: (type) => !get().shownNudges.includes(type),
}));
