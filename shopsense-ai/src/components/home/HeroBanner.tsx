'use client';
import { useVibeStore } from '@/lib/store/vibeStore';
import { getVibeGradient } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const VIBE_CONTENT: Record<string, { headline: string; sub: string; img: string }> = {
  casual:      { headline: 'Effortlessly You',       sub: 'Laid-back looks that never miss', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80' },
  festive:     { headline: 'Celebrate in Style',     sub: 'Looks that steal every spotlight', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80' },
  office:      { headline: 'Power Dressing',         sub: 'Command every room you walk into', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=80' },
  'date-night':{ headline: 'Romance, Redefined',     sub: 'Outfits that start conversations',  img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1400&q=80' },
  gifting:     { headline: 'Gifts They\'ll Love',    sub: 'Curated picks for every special one', img: 'https://images.unsplash.com/photo-1513201099705-a9746072f498?auto=format&fit=crop&w=1400&q=80' },
  gym:         { headline: 'Train Harder, Look Better', sub: 'Performance gear that performs', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80' },
  travel:      { headline: 'Pack Smart. Dress Sharp.', sub: 'Travel fits for every destination', img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80' },
};

export default function HeroBanner() {
  const vibe = useVibeStore((s) => s.selectedVibe);
  const content = VIBE_CONTENT[vibe] ?? VIBE_CONTENT.casual;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={vibe}
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginTop: 'calc(var(--navbar-height) + 49px)' }}
      >
        {/* Background image */}
        <motion.img
          key={content.img}
          src={content.img}
          alt={content.headline}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0) 100%)',
        }} />

        {/* Content */}
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            key={vibe + '-text'}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ maxWidth: 520 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 100,
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              color: 'white', fontSize: 12, fontWeight: 600, marginBottom: 16
            }}>
              ✨ Curated for your vibe
            </div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700, color: 'white', lineHeight: 1.15, marginBottom: 12
            }}>
              {content.headline}
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.82)', marginBottom: 28, lineHeight: 1.6 }}>
              {content.sub}
            </p>
            <a href="#feed">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: getVibeGradient(vibe), color: 'white',
                  border: 'none', borderRadius: 100, padding: '14px 32px',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                Explore Now <ChevronRight size={18} />
              </motion.button>
            </a>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
