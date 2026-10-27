'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const suggestions = ['Jaipur', 'Goa', 'Manali', 'Delhi', 'Kolkata', 'Mumbai', 'Udaipur', 'Varanasi'];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--gradient-hero)',
    }}>
      {/* Animated background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="animate-float" style={{
          position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
        }} />
        <div className="animate-float" style={{
          position: 'absolute', bottom: '10%', right: '15%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
          animationDelay: '1.5s',
        }} />
        <div className="animate-float" style={{
          position: 'absolute', top: '50%', right: '30%', width: '200px', height: '200px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          animationDelay: '3s',
        }} />
      </div>

      {/* Floating icons */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {['🏛️', '🌳', '🏖️', '🏔️', '🛕', '🎭', '🦁', '🏰'].map((emoji, i) => (
          <span key={i} className="animate-float" style={{
            position: 'absolute',
            fontSize: '2rem',
            opacity: 0.15,
            top: `${15 + (i * 10) % 70}%`,
            left: `${5 + (i * 13) % 85}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}>{emoji}</span>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: 'var(--radius-full)',
            background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)',
            marginBottom: '28px', fontSize: '0.9rem', color: 'var(--primary-light)',
          }}>
            <Sparkles size={16} /> Your Travel Discovery Starts Here
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em',
          }}>
            Discover More.{' '}
            <span className="gradient-text">Stay Local.</span>
            <br />Explore Better.
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7,
          }}>
            Find amazing places, hidden gems, local stays, picnic spots, museums and everything you need to explore your destination.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: 'relative', maxWidth: '620px', margin: '0 auto' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '8px 8px 8px 24px',
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}>
            <MapPin size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Where do you want to explore?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                color: 'var(--text-primary)', fontSize: '1.05rem',
                outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
            />
            <button onClick={() => handleSearch()} className="btn-primary" style={{
              padding: '12px 28px', borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Search size={18} />
              <span className="search-btn-text">Search</span>
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
              padding: '8px', zIndex: 10, animation: 'fadeIn 0.2s ease',
            }}>
              <p style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Popular Destinations
              </p>
              {suggestions.map((s) => (
                <button key={s} onMouseDown={() => handleSearch(s)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '10px 12px', background: 'transparent', border: 'none',
                  color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '8px',
                  fontSize: '0.95rem', textAlign: 'left', transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <MapPin size={16} style={{ color: 'var(--primary)' }} /> {s}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            display: 'flex', justifyContent: 'center', gap: '40px',
            marginTop: '48px', flexWrap: 'wrap',
          }}
        >
          {[
            { value: '500+', label: 'Places' },
            { value: '200+', label: 'Local Stays' },
            { value: '50+', label: 'Cities' },
            { value: '10K+', label: 'Travelers' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-light)' }}>{s.value}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 480px) {
          .search-btn-text { display: none; }
        }
      `}</style>
    </section>
  );
}
