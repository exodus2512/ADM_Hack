'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, X } from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import ProductCard from '../product/ProductCard';

export default function OutfitGenerator() {
  const [occasion, setOccasion] = useState('');
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState<any[] | null>(null);

  const generateOutfit = () => {
    if (!occasion) return;
    setLoading(true);
    setOutfit(null);
    setTimeout(() => {
      // Pick 3 random matching items for mockup
      setOutfit(mockProducts.slice(4, 7));
      setLoading(false);
    }, 1500);
  };

  return (
    <section style={{ padding: '60px 0', background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}>
      <div className="page-container">
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ background: 'var(--accent-gradient)', padding: 12, borderRadius: 16 }}>
              <Wand2 size={28} color="white" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>
            AI Outfit Generator
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
            Tell our AI where you're going, and we'll assemble the perfect head-to-toe look.
          </p>

          <div style={{ display: 'flex', gap: 12, maxWidth: 500, margin: '0 auto', marginBottom: 40 }}>
            <input
              className="input-field"
              placeholder="e.g., Beach wedding in Goa, Casual Friday..."
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateOutfit()}
            />
            <button className="btn-primary" onClick={generateOutfit} disabled={loading || !occasion} style={{ width: 'auto', whiteSpace: 'nowrap', display: 'flex', gap: 8, alignItems: 'center' }}>
              <Sparkles size={16} /> {loading ? 'Thinking...' : 'Generate'}
            </button>
          </div>

          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: 40 }}>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Scanning catalog for perfect matches...
                </p>
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20 }}>
                  <div className="skeleton" style={{ width: 180, height: 240, borderRadius: 16 }} />
                  <div className="skeleton" style={{ width: 180, height: 240, borderRadius: 16 }} />
                  <div className="skeleton" style={{ width: 180, height: 240, borderRadius: 16 }} />
                </div>
              </motion.div>
            )}

            {outfit && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#DCFCE7', color: '#16A34A', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
                  ✓ Outfit assembled for "{occasion}"
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {outfit.map((p) => (
                    <div key={p.id} style={{ maxWidth: 220, textAlign: 'left' }}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 32 }}>
                  <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }}>
                    Add Full Outfit to Cart — {outfit.reduce((s, i) => s + i.price, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
