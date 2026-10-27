'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, Clock, Ticket, Navigation, Heart, Share2, ChevronLeft, Calendar, Timer, ExternalLink } from 'lucide-react';
import { categoryConfig, formatPrice } from '@/lib/utils';
import { getDirectionsUrl, formatDistance, haversineDistance } from '@/lib/geo';
import PlaceCard from '@/components/cards/PlaceCard';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { toggleFavorite, checkFavorite } from '@/actions/favorites';

const ExploreMap = dynamic(() => import('@/components/maps/ExploreMap'), { ssr: false });

export default function PlaceDetailClient({ id }: { id: string }) {
  const [place, setPlace] = useState<any>(null);
  const [nearby, setNearby] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/places/${id}`);
        const data = await res.json();
        setPlace(data.place);
        setNearby(data.nearby || []);
        const fav = await checkFavorite(id, undefined);
        setIsFavorite(fav);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: place.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const handleFavorite = async () => {
    const res = await toggleFavorite(id, undefined);
    if (res.error) {
      toast.error(res.error);
    } else {
      setIsFavorite(res.saved!);
      toast.success(res.saved ? 'Saved to favorites!' : 'Removed from favorites');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: '32px' }}>
        <div className="skeleton" style={{ height: '400px', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '40px', width: '300px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '20px', width: '200px' }} />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontFamily: 'Outfit', marginBottom: '12px' }}>Place not found</h2>
        <Link href="/explore" className="btn-primary">Explore Places</Link>
      </div>
    );
  }

  const cat = categoryConfig[place.category] || { label: place.category, icon: '📍', color: '#94a3b8' };
  const images = place.images?.length > 0
    ? place.images.map((img: any) => img.imageUrl)
    : ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'];

  return (
    <div>
      {/* Image Gallery */}
      <div style={{ position: 'relative', height: '50vh', minHeight: '360px', overflow: 'hidden' }}>
        <img src={images[activeImage]} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,14,26,0.9) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)' }} />
        
        {/* Back Button */}
        <Link href="/explore" style={{
          position: 'absolute', top: '24px', left: '24px',
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-full)', color: 'white', fontSize: '0.9rem',
        }}>
          <ChevronLeft size={18} /> Back
        </Link>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '8px',
          }}>
            {images.slice(0, 5).map((img: string, i: number) => (
              <button key={i} onClick={() => setActiveImage(i)} style={{
                width: '60px', height: '44px', borderRadius: '8px', overflow: 'hidden',
                border: `2px solid ${i === activeImage ? 'var(--primary)' : 'transparent'}`,
                opacity: i === activeImage ? 1 : 0.6, cursor: 'pointer', padding: 0,
              }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}

        {/* Title Overlay */}
        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '0 24px 24px' }}>
          <div className="page-container">
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 14px', borderRadius: 'var(--radius-full)',
              background: `${cat.color}20`, color: cat.color, fontSize: '0.85rem', fontWeight: 500,
              marginBottom: '12px',
            }}>
              {cat.icon} {cat.label}
            </span>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '8px' }}>
              {place.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                <MapPin size={16} /> {place.city}, {place.state}
              </span>
              {place.ratingAvg > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 600 }}>
                  <Star size={16} fill="#fbbf24" /> {place.ratingAvg.toFixed(1)} ({place.reviewCount} reviews)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container" style={{ padding: '40px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
          {/* Main Content */}
          <div style={{ minWidth: 0 }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <a href={getDirectionsUrl(place.latitude, place.longitude, place.name)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Navigation size={16} /> Get Directions
              </a>
              <button onClick={handleShare} className="btn-secondary"><Share2 size={16} /> Share</button>
              <button onClick={handleFavorite} className="btn-secondary" style={isFavorite ? { color: '#ef4444', borderColor: '#ef4444' } : {}}>
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>About</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{place.description}</p>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {place.openingTime && (
                <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={20} style={{ color: 'var(--accent)' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hours</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{place.openingTime} - {place.closingTime}</p>
                  </div>
                </div>
              )}
              {place.entryFee != null && (
                <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Ticket size={20} style={{ color: '#f97316' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Entry Fee</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{place.entryFee === 0 ? 'Free' : formatPrice(place.entryFee)}</p>
                  </div>
                </div>
              )}
              {place.estimatedDuration && (
                <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Timer size={20} style={{ color: '#8b5cf6' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{place.estimatedDuration}</p>
                  </div>
                </div>
              )}
              {place.bestTimeToVisit && (
                <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={20} style={{ color: '#22c55e' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Best Time</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{place.bestTimeToVisit}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 600 }}>Reviews</h2>
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  Write Review
                </button>
              </div>

              {showReviewForm && (
                <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} onClick={() => setReviewRating(s)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                      }}>
                        <Star size={24} fill={s <= reviewRating ? '#fbbf24' : 'transparent'}
                          style={{ color: s <= reviewRating ? '#fbbf24' : 'var(--text-muted)' }} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                    className="input-field" placeholder="Share your experience..."
                    style={{ minHeight: '100px', resize: 'vertical', marginBottom: '12px' }} />
                  <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 24px' }}>
                    Submit Review
                  </button>
                </div>
              )}

              {place.reviews?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {place.reviews.map((review: any) => (
                    <div key={review.id} className="glass-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'var(--gradient-accent)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600,
                          }}>
                            {review.user?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{review.user?.name}</p>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} size={12} fill={s <= review.rating ? '#fbbf24' : 'transparent'}
                                  style={{ color: s <= review.rating ? '#fbbf24' : 'var(--text-muted)' }} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{review.reviewText}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>No reviews yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '100px' }}>
            {/* Map */}
            <div className="glass-card" style={{ height: '250px', overflow: 'hidden', marginBottom: '20px' }}>
              <ExploreMap places={[place]} />
            </div>

            {/* Coordinates */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Coordinates</p>
              <p style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}</p>
              <a href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`} target="_blank"
                rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)',
                  fontSize: '0.85rem', marginTop: '8px',
                }}>
                Open in Google Maps <ExternalLink size={14} />
              </a>
            </div>

            {/* Nearby */}
            {nearby.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Nearby Places</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {nearby.slice(0, 5).map((p: any) => (
                    <Link key={p.id} href={`/place/${p.id}`} className="glass-card glass-card-hover" style={{
                      display: 'flex', gap: '12px', padding: '12px', textDecoration: 'none',
                    }}>
                      <img src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&q=60'}
                        alt={p.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {categoryConfig[p.category]?.icon} {categoryConfig[p.category]?.label}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                          {formatDistance(haversineDistance(place.latitude, place.longitude, p.latitude, p.longitude))}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
