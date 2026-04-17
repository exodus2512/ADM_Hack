'use client';
import { useVibeStore } from '@/lib/store/vibeStore';
import { getVibeGradient } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const VIBES = [
  { id: 'casual',     label: 'Casual',     emoji: '☀️' },
  { id: 'festive',    label: 'Festive',    emoji: '🎉' },
  { id: 'office',     label: 'Office',     emoji: '💼' },
  { id: 'date-night', label: 'Date Night', emoji: '🌙' },
  { id: 'gifting',    label: 'Gifting',    emoji: '🎁' },
  { id: 'gym',        label: 'Gym',        emoji: '💪' },
  { id: 'travel',     label: 'Travel',     emoji: '✈️' },
] as const;

export default function VibeModeBar() {
  const { selectedVibe, setVibe } = useVibeStore();

  return (
    <div style={{ padding: '0 0 0', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
      <div className="page-container">
        <div
          className="hide-scrollbar"
          style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '12px 0' }}
        >
          {VIBES.map((v) => {
            const active = selectedVibe === v.id;
            return (
              <motion.button
                key={v.id}
                onClick={() => setVibe(v.id as any)}
                className="vibe-pill"
                style={active ? { background: getVibeGradient(v.id), color: 'white', border: 'none', boxShadow: `0 4px 16px rgba(0,0,0,0.15)` } : {}}
                whileTap={{ scale: 0.93 }}
                animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ type: 'tween', duration: 0.22, ease: 'easeInOut' }}
              >
                <span>{v.emoji}</span>
                <span>{v.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
