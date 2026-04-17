'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Clock, Sliders } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';

const MOCK_HISTORY = [
  { label: 'Linen Summer Kurta', date: 'Apr 2026', price: 1299, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80' },
  { label: 'Yoga Slim Leggings', date: 'Mar 2026', price: 799, img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=100&q=80' },
  { label: 'Floral Midi Dress', date: 'Feb 2026', price: 2499, img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=100&q=80' },
];

export default function ProfilePage() {
  const [budget, setBudget] = useState(3000);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);
  const signOutUser = useAuthStore((s) => s.signOutUser);
  const addToast = useToastStore((s) => s.addToast);

  const onGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      addToast('Signed in with Google', 'success');
    } catch {
      addToast('Google sign-in failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const onEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isRegisterMode) {
        await signUpWithEmail(email.trim(), password);
        addToast('Account created successfully', 'success');
      } else {
        await signInWithEmail(email.trim(), password);
        addToast('Signed in successfully', 'success');
      }
      setPassword('');
    } catch {
      addToast('Email/password authentication failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const onSignOut = async () => {
    setSubmitting(true);
    try {
      await signOutUser();
      addToast('Signed out successfully', 'success');
    } catch {
      addToast('Could not sign out. Please retry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 'var(--navbar-height)' }}>
      <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, marginBottom: 32 }}>
          My Style Profile
        </h1>

        {/* Profile Identity Block */}
        <div className="profile-card" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} color="white" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
                {user?.displayName ?? (initializing ? 'Checking session...' : 'Guest User')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {user?.email ?? 'Sign in to sync your profile across devices'}
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>❤️ {wishlistCount} wishlisted</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>🛍️ {MOCK_HISTORY.length} purchases</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            {!user ? (
              <>
                <button
                  className="btn-primary"
                  style={{ marginBottom: 12 }}
                  disabled={submitting || initializing}
                  onClick={onGoogleSignIn}
                >
                  {submitting ? 'Please wait...' : 'Continue with Google'}
                </button>
                <form onSubmit={onEmailAuth} style={{ display: 'grid', gap: 10 }}>
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: '10px 12px',
                      background: 'var(--bg-primary)',
                    }}
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: '10px 12px',
                      background: 'var(--bg-primary)',
                    }}
                  />
                  <button className="btn-secondary" type="submit" disabled={submitting || initializing}>
                    {submitting ? 'Working...' : isRegisterMode ? 'Create account' : 'Sign in with email'}
                  </button>
                </form>
                <button
                  onClick={() => setIsRegisterMode((prev) => !prev)}
                  style={{
                    marginTop: 8,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {isRegisterMode ? 'Already have an account? Sign in' : 'New here? Create an account'}
                </button>
              </>
            ) : (
              <button className="btn-outline" onClick={onSignOut} disabled={submitting}>
                {submitting ? 'Signing out...' : 'Sign out'}
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: 32, alignItems: 'start' }}>
          
          {/* Sidebar: Insights & Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* AI Style DNA Card */}
            <div className="surface" style={{ padding: 24, background: 'linear-gradient(145deg, var(--bg-secondary) 0%, var(--card-bg) 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                <Sparkles size={100} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Style DNA</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Updated 2 days ago</p>
                </div>
              </div>

              {/* Progress Bars Block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                    <span>Minimalist</span>
                    <span>78%</span>
                  </div>
                  <div style={{ background: 'var(--border)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1 }} style={{ background: 'var(--text-primary)', height: '100%' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                    <span>Athleisure</span>
                    <span>45%</span>
                  </div>
                  <div style={{ background: 'var(--border)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1 }} style={{ background: 'var(--text-primary)', height: '100%' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                    <span>Vibrant/Festive</span>
                    <span>32%</span>
                  </div>
                  <div style={{ background: 'var(--border)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '32%' }} transition={{ duration: 1 }} style={{ background: 'var(--text-primary)', height: '100%' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: 24, fontSize: 13, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                "You lean heavily towards high-quality basics with a muted palette. We are currently prioritizing clean lines and functional wear in your feed."
              </div>
            </div>
            
            <div className="surface" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Sliders size={18} style={{ color: '#FF6B6B' }} />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Preferences</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Budget Tier</span>
                  </div>
                  <input type="range" className="w-full" value={budget} onChange={(e) => setBudget(+e.target.value)} min={500} max={15000} step={500} style={{ accentColor: 'var(--text-primary)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>Value</span>
                    <span>Luxury</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area: Timeline Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="surface" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Purchase Timeline & Reorder</h3>
              <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 32 }}>
                
                {/* Item 1 */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -31, top: 0, background: 'var(--bg-primary)', border: '2px solid var(--text-primary)', width: 14, height: 14, borderRadius: '50%' }} />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Delivered • Oct 12, 2023</p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--bg-secondary)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                    <img src={MOCK_HISTORY[0].img} alt="Product" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600 }}>{MOCK_HISTORY[0].label}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>₹{MOCK_HISTORY[0].price}</p>
                    </div>
                    <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 12, width: 'auto' }}>Buy Again</button>
                  </div>
                </div>

                {/* Item 2 / Auto Reorder */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -31, top: 0, background: 'var(--bg-primary)', border: '2px solid var(--border)', width: 14, height: 14, borderRadius: '50%' }} />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Delivered • Jul 05, 2023</p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--bg-secondary)', padding: 16, borderRadius: 12, border: '1px solid rgba(59,130,246,0.3)' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 8, background: '#e5e5e5' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600 }}>Daily Face Wash</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>₹399</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#3B82F6', fontWeight: 600, justifyContent: 'flex-end', marginBottom: 8 }}>
                        <Clock size={14} /> Running low?
                      </div>
                      <button style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Auto-Reorder</button>
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -31, top: 0, background: 'var(--bg-primary)', border: '2px solid var(--border)', width: 14, height: 14, borderRadius: '50%' }} />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Delivered • Feb 10, 2023</p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--bg-secondary)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                    <img src={MOCK_HISTORY[2].img} alt="Product" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600 }}>{MOCK_HISTORY[2].label}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>₹{MOCK_HISTORY[2].price}</p>
                    </div>
                    <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 12, width: 'auto' }}>Buy Again</button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
