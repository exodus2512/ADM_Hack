'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Share2, ShieldCheck, RotateCcw, Truck, Zap, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { getProductById, mockProducts } from '@/lib/mockData';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import SizePredictor from '@/components/product/SizePredictor';

const MOCK_REVIEWS = [
  { id: 'r1', author: 'Priya M.', rating: 5, body: 'Absolutely love this! The fabric quality is top-notch and fits perfectly. Very true to size.', date: 'Mar 2026', verified: true },
  { id: 'r2', author: 'Rahul K.', rating: 4, body: 'Great product overall. The colour was slightly different from the photos but still gorgeous.', date: 'Feb 2026', verified: true },
  { id: 'r3', author: 'Sneha R.', rating: 5, body: 'Bought this for a wedding and got so many compliments! Fast delivery too.', date: 'Jan 2026', verified: false },
];

function ReviewDigest({ productId }: { productId: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}>
      <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>⭐ AI Review Summary</h3>

      {/* Sentiment bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: 'var(--text-muted)' }}>Overall Sentiment</span>
          <span style={{ fontWeight: 700, color: '#22C55E' }}>Very Positive</span>
        </div>
        <div className="sentiment-bar"><div className="sentiment-fill" style={{ width: '82%' }} /></div>
      </div>

      {/* Positives */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Customers Love</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Great fabric quality', 'True to size', 'Fast delivery', 'Elegant design'].map((p) => (
            <span key={p} style={{ background: '#DCFCE7', color: '#16A34A', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 100 }}>✓ {p}</span>
          ))}
        </div>
      </div>

      {/* Negatives */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Common Concerns</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Colour slightly different', 'Sizing runs small'].map((n) => (
            <span key={n} style={{ background: '#FEE2E2', color: '#991B1B', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 100 }}>✗ {n}</span>
          ))}
        </div>
      </div>

      <button onClick={() => setExpanded(!expanded)} style={{ fontSize: 13, color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
        {expanded ? '− Hide' : '+ Read all'} {MOCK_REVIEWS.length} reviews
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 16, overflow: 'hidden' }}>
            {MOCK_REVIEWS.map((r) => (
              <div key={r.id} style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{r.author}</span>
                    {r.verified && <span style={{ fontSize: 10, background: '#DCFCE7', color: '#16A34A', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>✓ VERIFIED</span>}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</span>
                </div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < r.rating ? '#FF8E53' : 'none'} stroke={i < r.rating ? '#FF8E53' : 'var(--border)'} />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{r.body}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const product = getProductById(params.id as string);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [mainImg, setMainImg] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const handleAddCart = () => {
    addItem(product, selectedSize, selectedColor?.name ?? '');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const similar = mockProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 'var(--navbar-height)' }}>
      <div className="page-container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Main product area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 48 }}>
          {/* LEFT: Image Gallery */}
          <div>
            {/* Main image */}
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '3/4', background: 'var(--bg-secondary)', marginBottom: 12 }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImg}
                  src={product.images[mainImg]}
                  alt={product.name}
                  initial={{ opacity: 0.6, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </AnimatePresence>
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'var(--accent-gradient)', color: 'white',
                fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 100
              }}>
                -{product.discount}%
              </div>
            </div>
            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 10 }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setMainImg(i)} style={{
                  width: 72, height: 88, borderRadius: 10, overflow: 'hidden', border: `2px solid ${mainImg === i ? '#FF6B6B' : 'var(--border)'}`, padding: 0, cursor: 'pointer',
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
              {product.brand}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.25, marginBottom: 12 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill={i < Math.floor(product.rating) ? '#FF8E53' : 'none'} stroke={i < Math.floor(product.rating) ? '#FF8E53' : 'var(--border)'} />
                ))}
              </div>
              <span style={{ fontWeight: 700 }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span className="price-current" style={{ fontSize: '2rem' }}>{formatPrice(product.price)}</span>
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
              <span style={{ background: '#DCFCE7', color: '#16A34A', fontWeight: 700, fontSize: 14, padding: '4px 10px', borderRadius: 100 }}>{product.discount}% OFF</span>
            </div>

            {/* AI Style Note */}
            <div style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.08), rgba(255,142,83,0.08))', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--text-primary)' }}>
                ✨ <strong>AI Insight:</strong> This pairs beautifully with your recent picks. A top match for your style.
              </p>
            </div>

            {/* Color */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                Color: <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{selectedColor?.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.colors.map((c) => (
                  <button key={c.name} title={c.name} onClick={() => setSelectedColor(c)}
                    className={`color-swatch ${selectedColor?.hex === c.hex ? 'active' : ''}`}
                    style={{ background: c.hex, border: c.hex === '#FFFFFF' ? '1.5px solid var(--border)' : 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                Size: <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{selectedSize}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`size-pill ${selectedSize === s ? 'active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <SizePredictor />
              <button style={{ fontSize: 12, color: '#FF6B6B', marginTop: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
                📏 Size Guide
              </button>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <motion.button
                onClick={handleAddCart}
                className="btn-primary"
                whileTap={{ scale: 0.97 }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {added ? '✓ Added to Cart!' : '🛍️ Add to Cart'}
              </motion.button>
              <button onClick={() => toggle(product)} style={{
                width: 52, height: 52, borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--card-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}>
                <Heart size={20} fill={wishlisted ? '#FF6B6B' : 'none'} stroke={wishlisted ? '#FF6B6B' : 'currentColor'} />
              </button>
              <button style={{
                width: 52, height: 52, borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--card-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}>
                <Share2 size={18} />
              </button>
            </div>

            {/* Stock warning */}
            {product.stock <= 5 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA' }}>
                <Zap size={14} style={{ color: '#EF4444' }} />
                <span style={{ fontSize: 13, color: '#991B1B', fontWeight: 600 }}>Only {product.stock} left in this size!</span>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
              {[
                { icon: <RotateCcw size={20} />, label: 'Easy Returns' },
                { icon: <ShieldCheck size={20} />, label: '100% Authentic' },
                { icon: <Truck size={20} />, label: 'Fast Delivery' },
              ].map((b) => (
                <div key={b.label} className="trust-badge">
                  <span style={{ color: '#FF6B6B' }}>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Delivery estimate */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input className="input-field" placeholder="Enter pincode for delivery estimate" style={{ fontSize: 13 }} />
              <button className="btn-secondary" style={{ whiteSpace: 'nowrap', fontSize: 13, padding: '10px 16px' }}>Check</button>
            </div>
          </div>
        </div>

        {/* Review Digest */}
        <ReviewDigest productId={product.id} />

        {/* Similar Products */}
        {similar.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 20 }}>
              You Might Also Like
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              {similar.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
