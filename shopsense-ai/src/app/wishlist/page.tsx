'use client';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 'var(--navbar-height)' }}>
      <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Heart size={24} style={{ color: '#FF6B6B' }} fill="#FF6B6B" />
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700 }}>
            My Wishlist
          </h1>
          <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 100, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
            {items.length} items
          </span>
        </div>

        {items.some(i => i.badges.includes('price-dropped')) && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: '#EF4444' }}>
            <span style={{ fontSize: 20 }}>↓</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Some items in your wishlist have dropped in price! Grab them before they're gone.</span>
          </div>
        )}

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Heart size={64} style={{ color: 'var(--border)', margin: '0 auto 16px' }} />
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Save products you love and find them here later</p>
            <Link href="/"><button className="btn-primary" style={{ width: 'auto', padding: '12px 28px' }}>Start Browsing</button></Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {items.map((product) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
