'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  { id: 'HISTORICAL', icon: '🏛️', label: 'History', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { id: 'PARK', icon: '🌳', label: 'Nature', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { id: 'PICNIC_SPOT', icon: '🧺', label: 'Picnic', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  { id: 'ZOO', icon: '🦁', label: 'Zoo', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { id: 'MUSEUM', icon: '🖼️', label: 'Museums', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  { id: 'BEACH', icon: '🏖️', label: 'Beaches', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  { id: 'HOTEL', icon: '🏨', label: 'Hotels', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { id: 'HOMESTAY', icon: '🏠', label: 'Local Stays', color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
  { id: 'RESTAURANT', icon: '🍴', label: 'Food', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { id: 'FORT', icon: '🏰', label: 'Forts', color: '#b45309', bg: 'rgba(180,83,9,0.1)' },
  { id: 'TEMPLE', icon: '🛕', label: 'Temples', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  { id: 'MOUNTAIN', icon: '🏔️', label: 'Mountains', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
];

export default function CategorySection() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 className="section-title">Explore by Interest</h2>
          <p className="section-subtitle">Discover places that match your travel style</p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '16px',
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/explore?category=${cat.id}`} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '12px', padding: '24px 16px',
                background: 'var(--gradient-glass)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)', textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = cat.color;
                e.currentTarget.style.boxShadow = `0 8px 30px ${cat.bg}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: cat.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.8rem',
                }}>
                  {cat.icon}
                </div>
                <span style={{
                  fontSize: '0.9rem', fontWeight: 500,
                  color: 'var(--text-secondary)',
                }}>
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
