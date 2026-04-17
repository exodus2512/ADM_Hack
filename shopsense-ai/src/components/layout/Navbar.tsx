'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useVibeStore } from '@/lib/store/vibeStore';
import { ShoppingBag, Search, Heart, User, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../search/SearchBar';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const user = useAuthStore((s) => s.user);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signOutUser = useAuthStore((s) => s.signOutUser);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleAuthAction = async () => {
    try {
      if (user) {
        await signOutUser();
        addToast('Signed out successfully', 'success');
        return;
      }

      await signInWithGoogle();
      addToast('Signed in with Google', 'success');
    } catch {
      addToast('Authentication failed. Please try again.', 'error');
    }
  };

  // Ctrl+K global shortcut
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <>
      <nav className="navbar" style={{ boxShadow: scrolled ? 'var(--shadow-md)' : 'none' }}>
        <div className="page-container h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span style={{ background: 'var(--accent-gradient)', borderRadius: 10, padding: '6px 8px', display: 'flex' }}>
              <Sparkles size={18} color="white" />
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'Inter', letterSpacing: '-0.5px' }}>
              <span className="gradient-text">Shop</span>
              <span style={{ color: 'var(--text-primary)' }}>Sense</span>
              <span className="gradient-text"> AI</span>
            </span>
          </Link>

          {/* Center search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <button
              onClick={() => setSearchOpen(true)}
              className="search-bar w-full cursor-pointer text-left"
              style={{ fontSize: 14, color: 'var(--text-muted)' }}
            >
              <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span className="flex-1">Search products, vibes, brands…</span>
              <span style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 6,
                background: 'var(--bg-secondary)', color: 'var(--text-muted)',
                border: '1px solid var(--border)', fontWeight: 600
              }}>⌘K</span>
            </button>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 md:hidden rounded-xl hover:bg-[var(--bg-secondary)]">
              <Search size={20} style={{ color: 'var(--text-primary)' }} />
            </button>
            <button onClick={() => {
              const html = document.documentElement;
              const isDark = html.classList.contains('dark');
              isDark ? html.classList.remove('dark') : html.classList.add('dark');
              html.style.colorScheme = isDark ? 'light' : 'dark';
            }} className="p-2 rounded-xl hover:bg-[var(--bg-secondary)]" title="Toggle Theme">
              <span className="hidden dark:block">☀️</span>
              <span className="block dark:hidden">🌙</span>
            </button>
            <Link href="/wishlist" className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] relative">
              <Heart size={20} style={{ color: 'var(--text-primary)' }} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    maxWidth: 110,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.displayName ?? user.email ?? 'Signed in'}
                </span>
              )}
              <button
                onClick={handleAuthAction}
                className="p-2 rounded-xl hover:bg-[var(--bg-secondary)]"
                title={user ? 'Sign out' : 'Sign in with Google'}
              >
                <User size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
              <Link href="/profile" className="p-2 rounded-xl hover:bg-[var(--bg-secondary)]" title="Profile">
                <span style={{ fontSize: 16 }}>{user ? '👤' : '🪪'}</span>
              </Link>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] relative"
            >
              <ShoppingBag size={20} style={{ color: 'var(--text-primary)' }} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-white text-xs font-bold rounded-full"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <SearchBar onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
