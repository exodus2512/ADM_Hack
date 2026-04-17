'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/lib/store/toastStore';
import { X } from 'lucide-react';

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
      display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end'
    }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: 'var(--shadow-md)', minWidth: 280,
              borderLeft: `4px solid ${toast.type === 'success' ? '#22C55E' : toast.type === 'error' ? '#EF4444' : '#3B82F6'}`
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <X size={14} style={{ color: 'var(--text-muted)' }} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
