'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQty, total, itemCount } = useCartStore();
  const [promoOpen, setPromoOpen] = useState(false);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const FREE_DELIVERY = 999;
  const subtotal = total();
  const delivery = subtotal >= FREE_DELIVERY ? 0 : 49;
  const discount = promoApplied ? Math.floor(subtotal * 0.1) : 0;
  const finalTotal = subtotal + delivery - discount;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 'var(--navbar-height)' }}>
      <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, marginBottom: 32 }}>
          🛍️ Smart Cart ({itemCount()} items)
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <ShoppingBag size={64} style={{ color: 'var(--border)', margin: '0 auto 16px' }} />
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Your cart is empty</h2>
            <Link href="/"><button className="btn-primary" style={{ width: 'auto', padding: '12px 28px', marginTop: 16 }}>Continue Shopping</button></Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'flex-start' }}>
            {/* Cart items */}
            <div>
              {items.map((item) => (
                <motion.div key={`${item.product.id}-${item.size}`} layout className="cart-item" style={{ marginBottom: 16 }}>
                  <img src={item.product.images[0]} alt={item.product.name} style={{ width: 96, height: 120, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 3 }}>{item.product.brand}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>{item.product.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Size: {item.size} • Color: {item.color}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Qty */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', borderRadius: 10, padding: '6px 12px', border: '1px solid var(--border)' }}>
                          <button onClick={() => item.quantity > 1 ? updateQty(item.product.id, item.size, item.quantity - 1) : removeItem(item.product.id, item.size)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, item.size, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.product.id, item.size)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                          <Trash2 size={15} /> Remove
                        </button>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 17 }}>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 8 }}>
                      ✨ 2 people recently bought this with similar items in your cart
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal ({itemCount()} items)</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                  <span style={{ fontWeight: 600, color: delivery === 0 ? '#22C55E' : 'var(--text-primary)' }}>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span>
                </div>
                {promoApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: '#22C55E' }}>Promo (SAVE10)</span>
                    <span style={{ fontWeight: 600, color: '#22C55E' }}>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              {/* Promo code */}
              <div style={{ marginBottom: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button onClick={() => setPromoOpen(!promoOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  <Tag size={15} style={{ color: '#FF6B6B' }} /> Apply Promo Code
                  {promoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {promoOpen && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <input className="input-field" placeholder="SAVE10" value={promo} onChange={(e) => setPromo(e.target.value)} style={{ fontSize: 13 }} />
                    <button className="btn-secondary" style={{ whiteSpace: 'nowrap', fontSize: 13, padding: '10px 14px' }} onClick={() => { if (promo === 'SAVE10') setPromoApplied(true); }}>
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 17, marginBottom: 20, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              <button className="btn-primary">Proceed to Checkout →</button>

              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                🔒 Secure checkout · Free returns · 100% authentic
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
