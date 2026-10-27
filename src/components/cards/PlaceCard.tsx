'use client';

import Link from 'next/link';
import { MapPin, Star, Clock, Ticket } from 'lucide-react';
import { categoryConfig, formatPrice } from '@/lib/utils';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    category: string;
    shortDescription?: string;
    description: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    ratingAvg: number;
    reviewCount: number;
    entryFee?: number | null;
    images: { id: string; imageUrl: string }[];
  };
  distance?: number;
}

export default function PlaceCard({ place, distance }: PlaceCardProps) {
  const cat = categoryConfig[place.category] || { label: place.category, icon: '📍', color: '#94a3b8' };
  const imageUrl = place.images?.[0]?.imageUrl || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=70`;

  return (
    <Link href={`/place/${place.id}`} style={{ textDecoration: 'none' }}>
      <div className="glass-card glass-card-hover" style={{
        overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
      }}>
        {/* Image */}
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img src={imageUrl} alt={place.name} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s', 
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
          
          {/* Category Badge */}
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 500,
            background: `${cat.color}20`, color: cat.color, backdropFilter: 'blur(8px)',
            border: `1px solid ${cat.color}30`,
          }}>
            {cat.icon} {cat.label}
          </span>

          {/* Rating */}
          {place.ratingAvg > 0 && (
            <span style={{
              position: 'absolute', top: '12px', right: '12px',
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
              fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24',
            }}>
              <Star size={12} fill="#fbbf24" /> {place.ratingAvg.toFixed(1)}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px', lineHeight: 1.3 }}>
            {place.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
            <MapPin size={14} /> {place.city}, {place.state}
          </div>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6,
            flex: 1, overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {place.shortDescription || place.description}
          </p>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {place.entryFee != null && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Ticket size={13} /> {place.entryFee === 0 ? 'Free' : formatPrice(place.entryFee)}
                </span>
              )}
              {place.reviewCount > 0 && (
                <span>{place.reviewCount} reviews</span>
              )}
            </div>
            {distance !== undefined && (
              <span style={{
                fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 500,
              }}>
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
