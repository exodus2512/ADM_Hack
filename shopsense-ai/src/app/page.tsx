'use client';
import VibeModeBar from '@/components/home/VibeModeBar';
import HeroBanner from '@/components/home/HeroBanner';
import PersonalizedFeed from '@/components/home/PersonalizedFeed';
import TrendingSection from '@/components/home/TrendingSection';
import OutfitGenerator from '@/components/home/OutfitGenerator';
import { useVibeStore } from '@/lib/store/vibeStore';
import { getVibeTint } from '@/lib/utils';

export default function HomePage() {
  const vibe = useVibeStore((s) => s.selectedVibe);

  return (
    <div className={getVibeTint(vibe)} style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 0.5s ease' }}>
      {/* Vibe bar sits right below fixed navbar */}
      <div style={{ paddingTop: 'var(--navbar-height)' }}>
        <VibeModeBar />
      </div>
      <HeroBanner />
      <OutfitGenerator />
      <PersonalizedFeed />
      <TrendingSection />

      {/* Complete the Look section */}
      <section style={{ padding: '56px 0', background: 'var(--bg-primary)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700 }}>
              ✨ Complete the Look
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 8 }}>
              Outfits AI thinks work perfectly together
            </p>
          </div>
          {/* Outfit cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { label: 'The Weekend Edit', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80', count: 4 },
              { label: 'Office Powerhouse', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', count: 5 },
              { label: 'Date Night Perfection', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80', count: 3 },
            ].map((outfit) => (
              <div key={outfit.label} className="product-card" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  <img src={outfit.img} alt={outfit.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 16, color: 'white' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 17 }}>{outfit.label}</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>{outfit.count} pieces</div>
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <button className="btn-secondary" style={{ width: '100%', fontSize: 13 }}>
                    Explore Outfit →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
              <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ShopSense AI</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 220 }}>
              Smarter shopping powered by AI — styled for your vibe, every time.
            </p>
          </div>
          {[
            { title: 'Shop', links: ['New Arrivals', 'Trending', 'Sale', 'Brands'] },
            { title: 'Support', links: ['Help Center', 'Returns', 'Track Order', 'Contact'] },
            { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map((l) => (
                  <a key={l} href="#" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32, color: 'var(--text-muted)', fontSize: 12 }}>
          © 2026 ShopSense AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
