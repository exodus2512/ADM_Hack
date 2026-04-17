'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Check, Ruler as RulerLine } from 'lucide-react';

export default function SizePredictor() {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(170);
  const [w, setW] = useState(65);
  const [fit, setFit] = useState<'tight' | 'regular' | 'loose'>('regular');
  const [predicted, setPredicted] = useState('');

  const predict = () => {
    // Mock algorithm
    if (h > 180 || w > 80) setPredicted(fit === 'loose' ? 'XL' : 'L');
    else if (h < 160 || w < 50) setPredicted(fit === 'loose' ? 'M' : 'S');
    else setPredicted(fit === 'loose' ? 'L' : 'M');
  };

  return (
    <div style={{ marginTop: 12, marginBottom: 12 }}>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#FF6B6B', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}>
          <Ruler size={14} /> AI Size Predictor
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700 }}>Find your perfect size</h4>
            <button onClick={() => setOpen(false)} style={{ fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>Close</button>
          </div>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <label style={{ flex: 1, fontSize: 12 }}>
              Height (cm): {h}
              <input type="range" min={140} max={200} value={h} onChange={(e) => setH(+e.target.value)} style={{ width: '100%', accentColor: 'var(--text-primary)', marginTop: 4 }} />
            </label>
            <label style={{ flex: 1, fontSize: 12 }}>
              Weight (kg): {w}
              <input type="range" min={40} max={120} value={w} onChange={(e) => setW(+e.target.value)} style={{ width: '100%', accentColor: 'var(--text-primary)', marginTop: 4 }} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['tight', 'regular', 'loose'].map((f) => (
              <button key={f} onClick={() => setFit(f as any)} style={{ flex: 1, padding: 6, fontSize: 12, borderRadius: 6, border: `1px solid ${fit === f ? 'var(--text-primary)' : 'var(--border)'}`, background: fit === f ? 'var(--text-primary)' : 'transparent', color: fit === f ? 'var(--bg-primary)' : 'var(--text-primary)' }}>
                {f} fit
              </button>
            ))}
          </div>

          {predicted ? (
            <div style={{ background: '#DCFCE7', color: '#16A34A', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
              <Check size={16} /> We recommend size {predicted}
            </div>
          ) : (
            <button onClick={predict} className="btn-primary" style={{ padding: '8px', fontSize: 13, width: '100%' }}>Predict Size</button>
          )}
        </motion.div>
      )}
    </div>
  );
}
