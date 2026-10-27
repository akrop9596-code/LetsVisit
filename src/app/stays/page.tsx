'use client';

import { useState, useEffect } from 'react';
import { Building, Search, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import Link from 'next/link';
import { propertyTypeConfig, formatPrice } from '@/lib/utils';

export default function StaysPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (type) params.set('type', type);
      const res = await fetch(`/api/properties/search?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        padding: '60px 0 40px', textAlign: 'center',
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, #1a1145 100%)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div className="page-container">
          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '12px' }}>
            Find Your <span className="gradient-text">Perfect Stay</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px' }}>
            Hotels, hostels, homestays & local homes — discover authentic places to stay
          </p>

          <div style={{
            display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto',
            padding: '6px 6px 6px 20px', background: 'var(--bg-card)',
            border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)',
          }}>
            <Search size={18} style={{ color: 'var(--text-muted)', alignSelf: 'center' }} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProperties()}
              placeholder="Search by city or location..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
            <button onClick={fetchProperties} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              Search
            </button>
          </div>

          {/* Type Filters */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
            {Object.entries(propertyTypeConfig).map(([key, val]) => (
              <button key={key} onClick={() => { setType(type === key ? '' : key); setTimeout(fetchProperties, 0); }} style={{
                padding: '8px 18px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem',
                background: type === key ? 'rgba(249, 115, 22, 0.15)' : 'var(--bg-card)',
                border: `1px solid ${type === key ? 'var(--primary)' : 'var(--border-color)'}`,
                color: type === key ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {val.icon} {val.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="page-container" style={{ padding: '40px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton" style={{ height: '340px' }} />)}
          </div>
        ) : properties.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {properties.map((prop: any) => (
              <Link key={prop.id} href={`/property/${prop.id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card glass-card-hover" style={{ overflow: 'hidden' }}>
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img src={prop.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=70'}
                      alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
                    <span style={{
                      position: 'absolute', top: '12px', left: '12px', padding: '4px 12px',
                      borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 500,
                      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white',
                    }}>
                      {propertyTypeConfig[prop.propertyType]?.icon} {propertyTypeConfig[prop.propertyType]?.label}
                    </span>
                    {prop.verificationStatus === 'APPROVED' && (
                      <span style={{
                        position: 'absolute', top: '12px', right: '12px', padding: '4px 10px',
                        borderRadius: 'var(--radius-full)', fontSize: '0.7rem',
                        background: 'rgba(20,184,166,0.2)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.3)',
                      }}>✓ Verified</span>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>{prop.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>
                      <MapPin size={14} /> {prop.city}, {prop.state}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {formatPrice(prop.pricePerNight)}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>/night</span>
                      </span>
                      {prop.ratingAvg > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem' }}>
                          <Star size={14} fill="#fbbf24" /> {prop.ratingAvg.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏠</div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', marginBottom: '8px' }}>No stays found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try searching for a different city</p>
          </div>
        )}
      </div>
    </div>
  );
}
