'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Camera, ShoppingBag, Star } from 'lucide-react';
import { Product, AiBadge } from '@/types/product';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { formatPrice } from '@/lib/utils';

import { useToastStore } from '@/lib/store/toastStore';
import { useSessionStore } from '@/lib/store/sessionStore';

const BADGE_CONFIG: Record<AiBadge, { label: string; className: string }> = {
  'trending-in-size': { label: '🔥 Trending', className: 'ai-badge ai-badge-trending' },
  'matches-style':    { label: '✨ Style Match',    className: 'ai-badge ai-badge-match' },
  'price-dropped':    { label: '↓ Price dropped',          className: 'ai-badge ai-badge-price-drop' },
  'low-stock':        { label: '⚡ Fast Selling',         className: 'ai-badge ai-badge-low-stock' },
};

interface Props {
  product: Product;
  onVisualSearch?: (product: Product) => void;
}

export default function ProductCard({ product, onVisualSearch }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const [heartPop, setHeartPop] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const logClick = useSessionStore((s) => s.logClick);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const badges = product.badges.slice(0, 2);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    setHeartPop(true);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
    setTimeout(() => setHeartPop(false), 400);
  };

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], product.colors[0]?.name ?? '');
    addToast('Added to cart', 'success');
  };

  return (
    <div onClick={() => logClick(product.id)} style={{ position: 'relative' }}>
    <Link href={`/product/${product.id}`}>
      <motion.div
        className="product-card context-card"
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Image */}
        <div
          style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--bg-secondary)' }}
          onMouseEnter={() => product.images[1] && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        >
          <img
            src={product.images[imgIdx] ?? product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          />

          {/* Discount badge */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'var(--accent-gradient)', color: 'white',
            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100
          }}>
            -{product.discount}%
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={heartPop ? 'heart-pop' : ''}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Heart
              size={16}
              fill={wishlisted ? '#FF6B6B' : 'none'}
              stroke={wishlisted ? '#FF6B6B' : '#666'}
            />
          </button>

          {/* Visual Match */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVisualSearch?.(product); }}
            className="visual-match-btn"
            title="Find visually similar"
          >
            <Camera size={15} style={{ color: '#666' }} />
          </button>

          {/* Quick Add */}
          <div className="quick-add" onClick={handleAddCart}>
            <button style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              color: 'white', fontWeight: 700, fontSize: 13, display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              <ShoppingBag size={15} /> Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 14px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            {product.brand}
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 8 }}>
            {product.name}
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <Star size={12} fill="#FF8E53" stroke="none" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{product.rating}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span className="price-current">{formatPrice(product.price)}</span>
            <span className="price-original">{formatPrice(product.originalPrice)}</span>
            <span className="price-discount">{product.discount}% off</span>
          </div>

          {/* AI Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, position: 'relative' }}>
            {badges.map((b) => (
              <span 
                key={b} 
                className={BADGE_CONFIG[b].className}
                onMouseEnter={() => setShowReason(true)}
                onMouseLeave={() => setShowReason(false)}
                style={{ cursor: 'help' }}
              >
                {BADGE_CONFIG[b].label}
              </span>
            ))}
            <AnimatePresence>
              {showReason && badges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    position: 'absolute', bottom: '100%', left: 0, marginBottom: 8,
                    background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12,
                    padding: '12px 14px', width: 220, boxShadow: 'var(--shadow-lg)', zIndex: 10
                  }}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Why recommended?</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>This item aligns with your recent browsing of {product.category} and matches your defined budget.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Social Proof */}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--border)' }}>
             <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
               {"👥 People with your style profile rated this 4.8"}
             </p>
          </div>
        </div>
      </motion.div>
    </Link>
    </div>
  );
}
