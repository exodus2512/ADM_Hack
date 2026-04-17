import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function classifyIntent(query: string): 'browsing' | 'buying' {
  const buyingSignals = [
    /under ₹?\d+/i,
    /below ₹?\d+/i,
    /size [a-z]{1,3}\b/i,
    /\bdelivery\b/i,
    /\bbuy\b/i,
    /\border\b/i,
    /\bprice\b/i,
    /\bcheap\b/i,
    /\bdiscount\b/i,
    /\boffer\b/i,
  ];
  return buyingSignals.some((r) => r.test(query)) ? 'buying' : 'browsing';
}

export function getVibeTint(vibe: string): string {
  const map: Record<string, string> = {
    casual: 'vibe-casual',
    festive: 'vibe-festive',
    office: 'vibe-office',
    'date-night': 'vibe-date-night',
    gifting: 'vibe-gifting',
    gym: 'vibe-gym',
    travel: 'vibe-travel',
  };
  return map[vibe] ?? '';
}

export function getVibeGradient(vibe: string): string {
  const map: Record<string, string> = {
    casual: 'linear-gradient(135deg,#6B9EFF,#4ECDC4)',
    festive: 'linear-gradient(135deg,#FFD700,#FF6B6B)',
    office: 'linear-gradient(135deg,#667EEA,#764BA2)',
    'date-night': 'linear-gradient(135deg,#F093FB,#F5576C)',
    gifting: 'linear-gradient(135deg,#4FACFE,#00F2FE)',
    gym: 'linear-gradient(135deg,#43E97B,#38F9D7)',
    travel: 'linear-gradient(135deg,#4481EB,#04BEFE)',
  };
  return map[vibe] ?? 'linear-gradient(135deg,#FF6B6B,#FF8E53)';
}

export function truncate(str: string, len = 40): string {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function getDiscountBadgeColor(pct: number): string {
  if (pct >= 40) return '#16A34A';
  if (pct >= 25) return '#2563EB';
  return '#DC2626';
}
