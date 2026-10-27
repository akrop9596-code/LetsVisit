'use client';

import { motion } from 'framer-motion';
import { MapPin, Compass, Home, Route } from 'lucide-react';

const features = [
  { icon: Compass, title: 'Discover Everything', desc: 'Find tourist spots, museums, forts, parks, restaurants — all on one map with real coordinates.', color: '#14b8a6' },
  { icon: MapPin, title: 'Radius-Based Search', desc: 'Search within 1km, 5km, 10km or any custom radius from your location or any place.', color: '#f97316' },
  { icon: Home, title: 'Stay Like a Local', desc: 'Book rooms, flats & homes directly from local residents. No middlemen, authentic experiences.', color: '#ec4899' },
  { icon: Route, title: 'Plan Your Trip', desc: 'Build day-by-day itineraries, optimize routes, and discover stays near your attractions.', color: '#8b5cf6' },
];

export default function FeaturesSection() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <h2 className="section-title">Why LetsVisit?</h2>
          <p className="section-subtitle">Not just another booking site — a complete travel discovery ecosystem</p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card glass-card-hover"
              style={{ padding: '32px', textAlign: 'center' }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: `${f.color}15`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 20px',
              }}>
                <f.icon size={28} style={{ color: f.color }} />
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
