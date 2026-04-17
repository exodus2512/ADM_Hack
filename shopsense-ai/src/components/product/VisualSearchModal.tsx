'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Image as ImageIcon, Sparkles } from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import ProductCard from '../product/ProductCard';

interface Props { onClose: () => void; }

export default function VisualSearchModal({ onClose }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(mockProducts.slice(0, 3).map(p => ({ ...p })));
  const [urlInput, setUrlInput] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      simulateSearch();
    };
    reader.readAsDataURL(file);
  }, []);

  const simulateSearch = () => {
    setLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults(mockProducts.slice(2, 8));
      setLoading(false);
    }, 1800);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1
  });

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card-bg)', borderRadius: 24, width: '95%', maxWidth: 760,
          maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'var(--accent-gradient)', borderRadius: 10, padding: 8, display: 'flex' }}>
              <Camera size={18} color="white" />
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 17 }}>Visual Search</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload an image to find similar products</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: 24 }}>
          {!preview ? (
            <>
              {/* Drop zone */}
              <div {...getRootProps()} className={`drop-zone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <div style={{ background: 'var(--accent-gradient)', borderRadius: '50%', padding: 16, display: 'flex' }}>
                  <Upload size={28} color="white" />
                </div>
                <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
                  {isDragActive ? 'Drop it here!' : 'Drag & drop an image'}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>or click to browse from your device</p>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '6px 14px', background: 'var(--bg-secondary)', borderRadius: 100, border: '1px solid var(--border)' }}>
                  JPG, PNG, WEBP supported
                </span>
              </div>

              {/* URL input */}
              <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>OR PASTE URL</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && urlInput) { setPreview(urlInput); simulateSearch(); } }}
                />
                <button
                  className="btn-primary"
                  style={{ width: 'auto', padding: '12px 20px' }}
                  onClick={() => { if (urlInput) { setPreview(urlInput); simulateSearch(); } }}
                >
                  Search
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Preview + results */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                <div style={{ flexShrink: 0 }}>
                  <img src={preview} alt="Uploaded" style={{ width: 120, height: 150, objectFit: 'cover', borderRadius: 12, border: '2px solid var(--accent-start)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Sparkles size={16} style={{ color: '#FF6B6B' }} />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>
                      {loading ? 'Analysing your image…' : 'Products visually similar to your image'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {loading ? 'Running CLIP visual embeddings…' : `Found ${results.length} matches`}
                  </p>
                  <button onClick={() => { setPreview(null); setResults([]); }} style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Try another image
                  </button>
                </div>
              </div>

              {/* Results grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={`sim-${i}`}>
                        <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 12 }} />
                        <div className="skeleton" style={{ height: 14, marginTop: 8, borderRadius: 6 }} />
                      </div>
                    ))
                  : results.map((p) => <ProductCard key={`sim-${p.id}`} product={p} />)
                }
              </div>

              {/* Complementary Section */}
              {!loading && results.length > 0 && (
                <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Sparkles size={16} style={{ color: '#FF6B6B' }} />
                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>Complete the look</h3>
                  </div>
                  <div className="hide-scrollbar" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                    {mockProducts.slice(7, 10).map((p) => (
                      <div key={`comp-${p.id}`} style={{ width: 160, flexShrink: 0 }}>
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
