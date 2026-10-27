'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Shield, Star, MapPin } from 'lucide-react';

export default function LocalStaysCTA() {
  return (
    <section style={{
      padding: '100px 0',
      background: 'var(--bg-secondary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-50%', right: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)',
      }} />
      
      <div className="page-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: 'var(--radius-full)',
              background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)',
              marginBottom: '20px', fontSize: '0.85rem', color: '#f43f5e',
            }}>
              <Home size={14} /> Local Stay Marketplace
            </div>
            <h2 style={{
              fontFamily: 'Outfit', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800, lineHeight: 1.15, marginBottom: '20px',
            }}>
              Have an empty room,<br />
              <span style={{ color: '#f43f5e' }}>flat or house?</span>
            </h2>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8,
              marginBottom: '32px', maxWidth: '460px',
            }}>
              Turn your unused space into a local stay for travelers. List your property, set your price, and welcome guests from around the world. Earn money while helping tourists experience authentic local living.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/register?role=PROPERTY_OWNER" className="btn-primary" style={{
                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
              }}>
                List Your Property <ArrowRight size={18} />
              </Link>
              <Link href="/stays" className="btn-secondary">
                Browse Stays
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
            }}>
              {[
                { icon: Shield, title: 'Verified Listings', desc: 'Admin-verified properties for trust', color: '#14b8a6' },
                { icon: Star, title: 'Guest Reviews', desc: 'Real feedback from travelers', color: '#f59e0b' },
                { icon: MapPin, title: 'Map Location', desc: 'Exact GPS coordinates shown', color: '#3b82f6' },
                { icon: Home, title: 'Any Property', desc: 'Rooms, flats, houses, villas', color: '#f43f5e' },
              ].map((item) => (
                <div key={item.title} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                  <item.icon size={24} style={{ color: item.color, marginBottom: '10px' }} />
                  <h4 style={{ fontFamily: 'Outfit', fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
