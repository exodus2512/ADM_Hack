'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, TrendingDown, Package } from 'lucide-react';
import { useNudgeStore } from '@/lib/store/nudgeStore';
import { useCartStore } from '@/lib/store/cartStore';

const NUDGE_ICONS = {
  'low-stock': <Zap size={18} color="#F59E0B" />,
  'price-drop': <TrendingDown size={18} color="#3B82F6" />,
  'delivery-threshold': <Package size={18} color="#22C55E" />,
};

export default function NudgePopup() {
  const { currentNudge, showNudge, dismissNudge, canShow } = useNudgeStore();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current || items.length === 0) return;

    // Delivery threshold nudge
    const FREE = 999;
    const remaining = FREE - total;
    if (remaining > 0 && remaining < 400 && canShow('delivery-threshold')) {
      idleTimer.current = setTimeout(() => {
        showNudge('delivery-threshold', `You're just ₹${Math.ceil(remaining)} away from FREE delivery! 🚚`);
        shown.current = true;
      }, 5000);
    }

    // Low stock nudge
    const lowStockItem = items.find((i) => i.product.stock <= 5);
    if (lowStockItem && canShow('low-stock') && !shown.current) {
      idleTimer.current = setTimeout(() => {
        showNudge('low-stock', `⚡ Only ${lowStockItem.product.stock} left of "${lowStockItem.product.name}" in your size!`);
        shown.current = true;
      }, 8000);
    }

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [items, total, canShow, showNudge]);

  // Idle detection
  useEffect(() => {
    let idle: NodeJS.Timeout;
    const resetIdle = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        if (items.length > 0 && canShow('low-stock')) {
          const item = items[0];
          showNudge('low-stock', `Still thinking? "${item.product.name}" is moving fast!`);
        }
      }, 20000);
    };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();
    return () => {
      clearTimeout(idle);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
    };
  }, [items, canShow, showNudge]);

  return (
    <AnimatePresence>
      {currentNudge && (
        <motion.div
          className="nudge-popup"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center',
            gap: 12, boxShadow: 'var(--shadow-lg)', minWidth: 320, maxWidth: 420
          }}>
            <div style={{ flexShrink: 0 }}>
              {NUDGE_ICONS[currentNudge.type as keyof typeof NUDGE_ICONS] ?? <Zap size={18} />}
            </div>
            <p style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {currentNudge.message}
            </p>
            <button
              onClick={dismissNudge}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
            >
              <X size={15} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
