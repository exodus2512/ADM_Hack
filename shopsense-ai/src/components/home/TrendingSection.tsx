'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';
import { mockProducts } from '@/lib/mockData';

const trending = mockProducts.slice(0, 6);

export default function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '0 0 56px', background: 'var(--bg-secondary)' }}>
      <div className="page-container" style={{ paddingTop: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700 }}>
              🔥 Trending Now
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>What everyone&apos;s shopping this week</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['left', 'right'] as const).map((d) => (
              <motion.button
                key={d}
                onClick={() => scroll(d)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                style={{
                  width: 40, height: 40, borderRadius: '50%', border: '1.5px solid var(--border)',
                  background: 'var(--card-bg)', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)'
                }}
              >
                {d === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </motion.button>
            ))}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}
        >
          {trending.map((p) => (
            <div key={p.id} style={{ minWidth: 220, maxWidth: 240, flexShrink: 0 }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
