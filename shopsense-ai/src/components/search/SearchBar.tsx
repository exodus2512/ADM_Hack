'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Camera, X, TrendingUp, Clock, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { classifyIntent } from '@/lib/utils';
import { useSearchStore } from '@/lib/store/searchStore';

const PLACEHOLDERS = [
  'Find a red kurta for a wedding…',
  'Something casually chic under ₹999…',
  'Office wear that feels premium…',
  'A gift for my best friend…',
  'Gym gear that looks good too…',
];

const TRENDING = ['Linen Co-ords', 'Floral Dresses', 'Minimal Watches', 'Comfort Sneakers', 'Silk Sarees'];
const RECENT   = ['Red kurta', 'Gym tee', 'Office bag'];

interface Props { onClose: () => void; }

export default function SearchBar({ onClose }: Props) {
  const [input, setInput] = useState('');
  const [pIdx] = useState(() => Math.floor(Math.random() * PLACEHOLDERS.length));
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const { setQuery, setIntent } = useSearchStore();

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support voice search.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      submit(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const submit = useCallback((q: string) => {
    if (!q.trim()) return;
    
    // Emotion mapping intercept
    const lc = q.toLowerCase();
    let finalQuery = q;
    if (lc.includes('confident') || lc.includes('powerful')) finalQuery = 'office formal power dressing';
    if (lc.includes('relaxed') || lc.includes('chill')) finalQuery = 'casual linen comfortable';

    const intent = classifyIntent(finalQuery);
    setQuery(finalQuery);
    setIntent(intent);
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
    onClose();
  }, [router, setQuery, setIntent, onClose]);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          width: '100%',
          maxWidth: 620,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          margin: '0 16px',
        }}
      >
        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <Search size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit(input)}
            placeholder={PLACEHOLDERS[pIdx]}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 16, color: 'var(--text-primary)', fontFamily: 'Inter',
            }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button 
              onClick={startVoiceSearch} 
              style={{ padding: 6, borderRadius: 8, background: isListening ? '#FF000020' : 'var(--bg-secondary)', border: 'none', cursor: 'pointer', position: 'relative' }} 
              title="Voice search"
            >
              {isListening && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #EF4444' }} />}
              <Mic size={16} style={{ color: isListening ? '#EF4444' : 'var(--text-muted)' }} />
            </button>
            <button style={{ padding: 6, borderRadius: 8, background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }} title="Visual search">
              <Camera size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
            <button onClick={onClose} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}>
              <X size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ padding: '16px 20px' }}>
          {/* Recent */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
              Recent
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {RECENT.map((r) => (
                <button
                  key={r}
                  onClick={() => submit(r)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', fontSize: 14 }}
                  className="hover:bg-[var(--bg-secondary)]"
                >
                  <Clock size={14} style={{ color: 'var(--text-muted)' }} /> {r}
                </button>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
              🔥 Trending Now
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => submit(t)}
                  style={{
                    padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Flame size={12} style={{ color: '#FF6B6B' }} />{t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit hint */}
        {input && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Search for <strong style={{ color: 'var(--text-primary)' }}>&ldquo;{input}&rdquo;</strong>
            </span>
            <button onClick={() => submit(input)} className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 13 }}>
              Search →
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
