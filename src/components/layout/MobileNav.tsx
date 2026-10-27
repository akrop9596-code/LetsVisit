'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Map, Heart, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/trip-planner', icon: Map, label: 'Trips' },
  { href: '/favorites', icon: Heart, label: 'Saved' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'rgba(10, 14, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-color)',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  width: '24px',
                  height: '2px',
                  background: 'var(--gradient-accent)',
                  borderRadius: '0 0 2px 2px',
                }} />
              )}
              <Icon size={20} />
              <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 600 : 400 }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
