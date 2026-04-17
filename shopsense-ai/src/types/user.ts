// src/types/user.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  sizeProfile: { tops: string; bottoms: string; shoes: string };
  colorPalette: string[];
  formality: number; // 0-100
  budget: { min: number; max: number };
  savedVibes: VibeMode[];
  purchaseHistory: string[]; // product ids
}

export type VibeMode =
  | 'casual'
  | 'festive'
  | 'office'
  | 'date-night'
  | 'gifting'
  | 'gym'
  | 'travel';

export interface UserPreferences {
  vibe: VibeMode;
  budget: { min: number; max: number };
  formality: number;
  colorPalette: string[];
}
