'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { SlidersHorizontal, Grid2X2, List, Eye } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mockData';
import { classifyIntent, formatPrice } from '@/lib/utils';
import { useSearchStore } from '@/lib/store/searchStore';
import { Product } from '@/types/product';

function IntentBanner({ intent, query }: { intent: 'browsing' | 'buying'; query: string }) {
  return (
    <motion.div
      key={intent}
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '10px 20px', background: intent === 'buying' ? '#EFF6FF' : '#F0FDF4',
        borderBottom: `2px solid ${intent === 'buying' ? '#BFDBFE' : '#BBF7D0'}`,
        display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
      }}
    >
      <span style={{ fontSize: 16 }}>{intent === 'buying' ? '🛍️' : '👀'}</span>
      <span style={{ color: intent === 'buying' ? '#1D4ED8' : '#15803D', fontWeight: 600 }}>
        {intent === 'browsing'
          ? 'Browsing mode — Showing you inspiration. Refine anytime.'
          : 'Buying mode — Showing best matches with price & availability first.'}
      </span>
    </motion.div>
  );
}

function FilterPanel({ onFilter }: { onFilter: (key: string, val: string) => void }) {
  const [maxPrice, setMaxPrice] = useState(10000);
  const categories = ['Ethnic Wear', 'Dresses', 'Tops', 'Bottoms', 'Sportswear', 'Bags', 'Co-ords'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Black', hex: '#000' }, { name: 'White', hex: '#fff' },
    { name: 'Navy', hex: '#1C2F5A' }, { name: 'Beige', hex: '#F5F0E8' },
    { name: 'Coral', hex: '#FF6B6B' }, { name: 'Green', hex: '#22C55E' },
  ];

  return (
    <div style={{ width: 240, flexShrink: 0 }}>
      <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--border)', padding: 20, position: 'sticky', top: 90 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={16} /> Filters
        </div>

        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 10 }}>Category</div>
          {categories.map((c) => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" onChange={() => onFilter('category', c)} style={{ accentColor: '#FF6B6B' }} />
              {c}
            </label>
          ))}
        </div>

        {/* Price */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 10 }}>Max Price</div>
          <input type="range" min={0} max={15000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)}
            style={{ width: '100%', accentColor: '#FF6B6B' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            <span>₹0</span><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatPrice(maxPrice)}</span>
          </div>
        </div>

        {/* Size */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 10 }}>Size</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {sizes.map((s) => (
              <button key={s} onClick={() => onFilter('size', s)} className="size-pill" style={{ padding: '5px 12px', fontSize: 12 }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 10 }}>Color</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {colors.map((c) => (
              <button key={c.name} title={c.name} className="color-swatch" style={{ background: c.hex, border: c.hex === '#fff' ? '1.5px solid var(--border)' : 'none' }} onClick={() => onFilter('color', c.name)} />
            ))}
          </div>
        </div>

        {/* AI Profile toggle */}
        <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <span>✨ Match my style</span>
            <input type="checkbox" style={{ accentColor: '#FF6B6B', width: 16, height: 16 }} />
          </label>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Only show items that match your AI style profile</p>
        </div>
      </div>
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [intent, setIntent] = useState<'browsing' | 'buying'>('browsing');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setLoading(true);
    const detected = classifyIntent(query);
    setIntent(detected);
    setTimeout(() => {
      const filtered = query
        ? mockProducts.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
            p.category.toLowerCase().includes(query.toLowerCase())
          )
        : mockProducts;
      setProducts(filtered.length > 0 ? filtered : mockProducts);
      setLoading(false);
    }, 600);
  }, [query]);

  const handleFilter = (key: string, val: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key]?.includes(val) ? prev[key].filter((v) => v !== val) : [...(prev[key] ?? []), val],
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 'var(--navbar-height)' }}>
      {/* Intent banner */}
      <IntentBanner intent={intent} query={query} />

      <div className="page-container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700 }}>
              {query ? `Results for "${query}"` : 'All Products'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              {loading ? 'Searching…' : `${products.length} products found`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setView('grid')} style={{ padding: 8, borderRadius: 8, border: `1.5px solid ${view === 'grid' ? 'var(--accent-start)' : 'var(--border)'}`, background: 'var(--card-bg)', cursor: 'pointer' }}>
              <Grid2X2 size={16} style={{ color: view === 'grid' ? '#FF6B6B' : 'var(--text-muted)' }} />
            </button>
            <button onClick={() => setView('list')} style={{ padding: 8, borderRadius: 8, border: `1.5px solid ${view === 'list' ? 'var(--accent-start)' : 'var(--border)'}`, background: 'var(--card-bg)', cursor: 'pointer' }}>
              <List size={16} style={{ color: view === 'list' ? '#FF6B6B' : 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* Filter sidebar */}
          <div className="hidden md:block">
            <FilterPanel onFilter={handleFilter} />
          </div>

          {/* Results */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                    <div style={{ padding: 14 }}>
                      <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 16, width: '80%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <LayoutGroup>
                <motion.div
                  layout
                  style={{
                    display: 'grid',
                    gridTemplateColumns: intent === 'buying'
                      ? 'repeat(auto-fill, minmax(180px, 1fr))'
                      : 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 20,
                    transition: 'grid-template-columns 0.3s ease',
                  }}
                >
                  <AnimatePresence>
                    {products.map((p) => (
                      <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ProductCard product={p} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
