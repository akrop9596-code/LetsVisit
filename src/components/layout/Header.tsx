'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  MapPin, Search, Menu, X, User, Heart, Map, Home, LogOut,
  Building, Shield, Compass, PlaneTakeoff
} from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const userRole = (session?.user as any)?.role;

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(10, 14, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div className="page-container">
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Compass size={22} color="white" />
            </div>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}>
              <span className="gradient-text">Lets</span>
              <span style={{ color: 'var(--text-primary)' }}>Visit</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Link href="/explore" className="btn-ghost">
              <Search size={16} /> Explore
            </Link>
            <Link href="/stays" className="btn-ghost">
              <Building size={16} /> Stays
            </Link>
            <Link href="/trip-planner" className="btn-ghost">
              <Map size={16} /> Trip Planner
            </Link>

            {!session ? (
              <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                <Link href="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                  Log In
                </Link>
                <Link href="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <div style={{ position: 'relative', marginLeft: '8px' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--gradient-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}>
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {session.user.name?.split(' ')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '220px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{session.user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.user.email}</p>
                    </div>
                    <div style={{ padding: '6px' }}>
                      <Link href="/profile" onClick={() => setProfileOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <User size={16} /> Profile
                      </Link>
                      <Link href="/favorites" onClick={() => setProfileOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Heart size={16} /> Favorites
                      </Link>
                      {userRole === 'PROPERTY_OWNER' && (
                        <Link href="/owner" onClick={() => setProfileOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Building size={16} /> My Properties
                        </Link>
                      )}
                      {userRole === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setProfileOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Shield size={16} /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div style={{ padding: '6px', borderTop: '1px solid var(--border-color)' }}>
                      <button onClick={() => signOut()}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          top: '72px',
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(20px)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          animation: 'fadeIn 0.2s ease',
        }}>
          <Link href="/explore" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '14px 16px', fontSize: '1.05rem' }}>
            <Search size={20} /> Explore Places
          </Link>
          <Link href="/stays" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '14px 16px', fontSize: '1.05rem' }}>
            <Building size={20} /> Find Stays
          </Link>
          <Link href="/trip-planner" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '14px 16px', fontSize: '1.05rem' }}>
            <Map size={20} /> Trip Planner
          </Link>
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />
          {!session ? (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>Log In</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ justifyContent: 'center' }}>Sign Up</Link>
            </>
          ) : (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '14px 16px' }}>
                <User size={20} /> Profile
              </Link>
              <Link href="/favorites" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '14px 16px' }}>
                <Heart size={20} /> Favorites
              </Link>
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '14px 16px', color: '#ef4444' }}>
                <LogOut size={20} /> Sign Out
              </button>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
