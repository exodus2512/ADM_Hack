'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQty, total, itemCount } = useCartStore();
  const FREE_DELIVERY_THRESHOLD = 999;
  const remaining = FREE_DELIVERY_THRESHOLD - total();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleCart}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9998 }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 420,
              background: 'var(--card-bg)', zIndex: 9999, display: 'flex', flexDirection: 'column',
              borderLeft: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={20} style={{ color: 'var(--text-primary)' }} />
                <span style={{ fontWeight: 700, fontSize: 18 }}>My Cart</span>
                {itemCount() > 0 && (
                  <span style={{ background: 'var(--accent-gradient)', color: 'white', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>
                    {itemCount()}
                  </span>
                )}
              </div>
              <button onClick={toggleCart} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}>
                <X size={18} style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            {/* Free delivery bar */}
            {remaining > 0 && items.length > 0 && (
              <div style={{ padding: '12px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Add <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(remaining)}</strong> more for free delivery 🎉
                </p>
                <div className="sentiment-bar">
                  <div className="sentiment-fill" style={{ width: `${Math.min(100, (total() / FREE_DELIVERY_THRESHOLD) * 100)}%` }} />
                </div>
              </div>
            )}

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 12 }}>
                  <ShoppingBag size={48} style={{ color: 'var(--border)' }} />
                  <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Your cart is empty</p>
                  <button onClick={toggleCart} className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="cart-item">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.product.brand}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2, marginBottom: 4, color: 'var(--text-primary)' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                        Size: {item.size} • {item.color}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Qty stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', borderRadius: 8, padding: '4px 8px' }}>
                          <button
                            onClick={() => item.quantity > 1 ? updateQty(item.product.id, item.size, item.quantity - 1) : removeItem(item.product.id, item.size)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                          >
                            <Minus size={14} style={{ color: 'var(--text-primary)' }} />
                          </button>
                          <span style={{ fontWeight: 700, fontSize: 14, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.product.id, item.size, item.quantity + 1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                          >
                            <Plus size={14} style={{ color: 'var(--text-primary)' }} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: 15 }}>{formatPrice(item.product.price * item.quantity)}</span>
                          <button onClick={() => removeItem(item.product.id, item.size)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <Trash2 size={15} style={{ color: '#EF4444' }} />
                          </button>
                        </div>
                      </div>
                      {/* AI insight */}
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>
                        ✨ Popular choice with your style profile
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Subtotal</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{formatPrice(total())}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Delivery</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: remaining > 0 ? 'var(--text-primary)' : '#22C55E' }}>
                    {remaining > 0 ? formatPrice(49) : 'FREE'}
                  </span>
                </div>
                <Link href="/cart" onClick={toggleCart}>
                  <button className="btn-primary">
                    Proceed to Checkout →
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
