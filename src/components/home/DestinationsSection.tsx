'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const destinations = [
  { name: 'Jaipur', state: 'Rajasthan', places: 45, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', color: '#f59e0b' },
  { name: 'Goa', state: 'Goa', places: 38, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', color: '#06b6d4' },
  { name: 'Manali', state: 'Himachal Pradesh', places: 28, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', color: '#22c55e' },
  { name: 'Delhi', state: 'Delhi', places: 52, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', color: '#ef4444' },
  { name: 'Kolkata', state: 'West Bengal', places: 35, image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80', color: '#a855f7' },
  { name: 'Mumbai', state: 'Maharashtra', places: 42, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', color: '#3b82f6' },
  { name: 'Udaipur', state: 'Rajasthan', places: 30, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', color: '#ec4899' },
  { name: 'Varanasi', state: 'Uttar Pradesh', places: 25, image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', color: '#f97316' },
];

export default function DestinationsSection() {
  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}
        >
          <div>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>Explore the most loved places across India</p>
          </div>
          <Link href="/explore" className="btn-ghost" style={{ color: 'var(--primary)' }}>
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/explore?q=${dest.name}`} style={{
                display: 'block', position: 'relative', borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', aspectRatio: '4/3', textDecoration: 'none',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <img src={dest.image} alt={dest.name} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px',
                }}>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>
                    {dest.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <MapPin size={14} /> {dest.state}
                    <span style={{ margin: '0 4px', opacity: 0.4 }}>•</span>
                    <span style={{ color: dest.color }}>{dest.places} places</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
