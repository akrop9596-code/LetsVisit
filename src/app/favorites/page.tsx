'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Star, Trash2, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getFavorites, toggleFavorite } from '@/actions/favorites';
import { categoryConfig, propertyTypeConfig, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<{ places: any[]; properties: any[] }>({ places: [], properties: [] });
  const [tab, setTab] = useState<'places' | 'properties'>('places');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleRemovePlace = async (placeId: string) => {
    const result = await toggleFavorite(placeId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Removed from favorites');
      setFavorites(prev => ({
        ...prev,
        places: prev.places.filter(p => p.id !== placeId),
      }));
    }
  };

  const handleRemoveProperty = async (propertyId: string) => {
    const result = await toggleFavorite(undefined, propertyId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Removed from favorites');
      setFavorites(prev => ({
        ...prev,
        properties: prev.properties.filter(p => p.id !== propertyId),
      }));
    }
  };

  const currentItems = tab === 'places' ? favorites.places : favorites.properties;

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          <Heart size={28} style={{ color: '#f43f5e', display: 'inline', marginRight: '8px' }} />
          Your <span className="gradient-text">Favorites</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Places and stays you&apos;ve saved for later</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', padding: '4px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', width: 'fit-content', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
        <button onClick={() => setTab('places')} style={{
          padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
          background: tab === 'places' ? 'var(--primary)' : 'transparent',
          color: tab === 'places' ? 'white' : 'var(--text-secondary)',
          fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s',
        }}>Places ({favorites.places.length})</button>
        <button onClick={() => setTab('properties')} style={{
          padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
          background: tab === 'properties' ? 'var(--primary)' : 'transparent',
          color: tab === 'properties' ? 'white' : 'var(--text-secondary)',
          fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s',
        }}>Stays ({favorites.properties.length})</button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 size={40} style={{ color: 'var(--primary)', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading favorites...</p>
          <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && currentItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💝</div>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', marginBottom: '8px' }}>
            No {tab === 'places' ? 'places' : 'stays'} saved yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Start exploring and save {tab === 'places' ? 'places' : 'stays'} you love</p>
          <Link href={tab === 'places' ? '/explore' : '/stays'} className="btn-primary">
            Explore {tab === 'places' ? 'Places' : 'Stays'}
          </Link>
        </div>
      ) : !loading && tab === 'places' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {favorites.places.map(place => {
            const cat = categoryConfig[place.category] || { label: place.category, icon: '📍', color: '#3b82f6' };
            const img = place.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=60';

            return (
              <div key={place.id} className="glass-card glass-card-hover" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img src={img} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {cat.icon} {cat.label}
                    </span>
                  </div>
                  <button onClick={() => handleRemovePlace(place.id)} style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', backdropFilter: 'blur(8px)',
                  }}>
                    <Heart size={16} fill="#f43f5e" style={{ color: '#f43f5e' }} />
                  </button>
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>{place.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {place.city}</span>
                    {place.ratingAvg > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                        <Star size={13} fill="#fbbf24" /> {place.ratingAvg.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <Link href={`/place/${place.id}`} className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', padding: '8px' }}>
                    View Details <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {favorites.properties.map(prop => {
            const typeInfo = propertyTypeConfig[prop.propertyType] || { label: prop.propertyType, icon: '🏠' };
            const img = prop.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=60';

            return (
              <div key={prop.id} className="glass-card glass-card-hover" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img src={img} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.75rem' }}>
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                  </div>
                  <button onClick={() => handleRemoveProperty(prop.id)} style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', backdropFilter: 'blur(8px)',
                  }}>
                    <Heart size={16} fill="#f43f5e" style={{ color: '#f43f5e' }} />
                  </button>
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>{prop.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {prop.city}</span>
                    {prop.ratingAvg > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                        <Star size={13} fill="#fbbf24" /> {prop.ratingAvg.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                      {formatPrice(prop.pricePerNight)}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/night</span>
                    </span>
                  </div>
                  <Link href={`/property/${prop.id}`} className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', padding: '8px' }}>
                    View Property <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
