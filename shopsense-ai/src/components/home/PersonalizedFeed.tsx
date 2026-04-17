'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';
import { useVibeStore } from '@/lib/store/vibeStore';
import { getProductsByVibe } from '@/lib/mockData';
import { Product } from '@/types/product';

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
      <div className="skeleton" style={{ aspectRatio: '3/4' }} />
      <div style={{ padding: 14 }}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '55%' }} />
      </div>
    </div>
  );
}

export default function PersonalizedFeed() {
  const vibe = useVibeStore((s) => s.selectedVibe);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts(getProductsByVibe(vibe));
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [vibe]);

  return (
    <section id="feed" style={{ padding: '48px 0' }}>
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              For You
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
              AI-curated picks based on your vibe &amp; style
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
            background: 'var(--bg-secondary)', borderRadius: 100, border: '1px solid var(--border)'
          }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>AI Picks</span>
          </div>
        </div>

        <div className="masonry-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  style={{ marginBottom: 20 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))
          }
        </div>

        {/* Load more sentinel */}
        <div ref={sentinelRef} style={{ height: 40 }} />
      </div>
    </section>
  );
}
