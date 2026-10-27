'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, MapPin, Star, Grid3X3, Map as MapIcon } from 'lucide-react';
import { categoryConfig, formatPrice } from '@/lib/utils';
import { haversineDistance, formatDistance } from '@/lib/geo';
import PlaceCard from '@/components/cards/PlaceCard';
import dynamic from 'next/dynamic';

const ExploreMap = dynamic(() => import('@/components/maps/ExploreMap'), { ssr: false });

const categories = Object.entries(categoryConfig);
const radiusOptions = [1, 5, 10, 25, 50];
const ratingOptions = [3, 4, 4.5];
const countryOptions = ['India', 'France', 'Italy', 'United Kingdom', 'United States', 'Hong Kong', 'Mongolia', 'Peru', 'United Arab Emirates'];

interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription?: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  ratingAvg: number;
  reviewCount: number;
  entryFee?: number;
  images: { id: string; imageUrl: string }[];
  _count?: { reviews: number };
}

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [radius, setRadius] = useState(25);
  const [minRating, setMinRating] = useState(0);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      if (minRating > 0) params.set('minRating', String(minRating));
      if (selectedCountries.length > 0) params.set('countries', selectedCountries.join(','));

      const res = await fetch(`/api/places/search?${params.toString()}`);
      const data = await res.json();
      setPlaces(data.places || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setLoading(false);
    }
  }, [query, category, minRating, selectedCountries]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlaces();
  };

  const clearFilters = () => {
    setCategory('');
    setMinRating(0);
    setRadius(25);
    setSelectedCountries([]);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Search Header */}
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)',
        padding: '20px 0', position: 'sticky', top: '72px', zIndex: 10,
        backdropFilter: 'blur(20px)',
      }}>
        <div className="page-container">
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: '12px', alignItems: 'center',
          }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)', padding: '4px 4px 4px 20px',
            }}>
              <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search places, cities, attractions..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.95rem', padding: '10px 0',
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                Search
              </button>
            </div>
            <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="btn-secondary"
              style={{ padding: '12px', borderRadius: 'var(--radius-md)', position: 'relative' }}>
              <SlidersHorizontal size={20} />
              {(category || minRating > 0 || selectedCountries.length > 0) && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px',
                  borderRadius: '50%', background: 'var(--primary)',
                }} />
              )}
            </button>
          </form>

          {/* Active Filters */}
          {(category || minRating > 0 || selectedCountries.length > 0) && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {category && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
                  background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)',
                  borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary)',
                }}>
                  {categoryConfig[category]?.icon} {categoryConfig[category]?.label}
                  <button onClick={() => setCategory('')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
                  background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)',
                  borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: '#fbbf24',
                }}>
                  <Star size={12} /> {minRating}+
                  <button onClick={() => setMinRating(0)} style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedCountries.length > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
                  background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: '#a855f7',
                }}>
                  🌍 {selectedCountries.length} Countr{selectedCountries.length > 1 ? 'ies' : 'y'}
                  <button onClick={() => setSelectedCountries([])} style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </span>
              )}
              <button onClick={clearFilters} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      {filtersOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40, display: 'flex', justifyContent: 'flex-end',
        }}>
          <div onClick={() => setFiltersOpen(false)} style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
          }} />
          <div className="animate-slide-in-right" style={{
            position: 'relative', width: '360px', maxWidth: '90vw',
            background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)',
            padding: '24px', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 600 }}>Filters</h3>
              <button onClick={() => setFiltersOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>Category</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map(([key, val]) => (
                  <button key={key} onClick={() => setCategory(category === key ? '' : key)} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem',
                    background: category === key ? `${val.color}20` : 'var(--bg-card)',
                    border: `1px solid ${category === key ? val.color : 'var(--border-color)'}`,
                    color: category === key ? val.color : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {val.icon} {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Filter */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Country</h4>
                {selectedCountries.length > 0 && (
                  <button onClick={() => setSelectedCountries([])} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                    All Countries
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button onClick={() => setSelectedCountries([])} style={{
                  padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem',
                  background: selectedCountries.length === 0 ? 'var(--primary)' : 'var(--bg-card)',
                  color: selectedCountries.length === 0 ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${selectedCountries.length === 0 ? 'var(--primary)' : 'var(--border-color)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  All Countries
                </button>
                {countryOptions.map(c => {
                  const isSelected = selectedCountries.includes(c);
                  return (
                    <button key={c} onClick={() => {
                      if (isSelected) {
                        setSelectedCountries(selectedCountries.filter(sc => sc !== c));
                      } else {
                        setSelectedCountries([...selectedCountries, c]);
                      }
                    }} style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem',
                      background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'var(--bg-card)',
                      border: `1px solid ${isSelected ? '#a855f7' : 'var(--border-color)'}`,
                      color: isSelected ? '#a855f7' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating Filter */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>Minimum Rating</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                {ratingOptions.map((r) => (
                  <button key={r} onClick={() => setMinRating(minRating === r ? 0 : r)} style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem',
                    background: minRating === r ? 'rgba(251, 191, 36, 0.15)' : 'var(--bg-card)',
                    border: `1px solid ${minRating === r ? '#fbbf24' : 'var(--border-color)'}`,
                    color: minRating === r ? '#fbbf24' : 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Star size={14} /> {r}+
                  </button>
                ))}
              </div>
            </div>

            {/* Radius Filter */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>Distance Radius</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {radiusOptions.map((r) => (
                  <button key={r} onClick={() => setRadius(r)} style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem',
                    background: radius === r ? 'rgba(20, 184, 166, 0.15)' : 'var(--bg-card)',
                    border: `1px solid ${radius === r ? '#14b8a6' : 'var(--border-color)'}`,
                    color: radius === r ? '#14b8a6' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}>
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={clearFilters} className="btn-secondary" style={{ flex: 1 }}>Clear</button>
              <button onClick={() => { fetchPlaces(); setFiltersOpen(false); }} className="btn-primary" style={{ flex: 1 }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="page-container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {loading ? 'Searching...' : `${total} places found`}
            {query && <span> for &ldquo;<strong style={{ color: 'var(--text-primary)' }}>{query}</strong>&rdquo;</span>}
          </p>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '4px', border: '1px solid var(--border-color)' }}>
            <button onClick={() => setViewMode('grid')} style={{
              padding: '8px', borderRadius: '6px', background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
              border: 'none', cursor: 'pointer', color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
            }}><Grid3X3 size={16} /></button>
            <button onClick={() => setViewMode('map')} style={{
              padding: '8px', borderRadius: '6px', background: viewMode === 'map' ? 'var(--primary)' : 'transparent',
              border: 'none', cursor: 'pointer', color: viewMode === 'map' ? 'white' : 'var(--text-muted)',
            }}><MapIcon size={16} /></button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          places.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', marginBottom: '8px' }}>No places found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters</p>
            </div>
          )
        ) : (
          <div style={{ height: '600px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <ExploreMap places={places} />
          </div>
        )}
      </div>
    </div>
  );
}
