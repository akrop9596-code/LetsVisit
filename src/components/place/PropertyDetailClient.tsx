'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, Heart, Share2, ChevronLeft, Users, Bed, Bath, DoorOpen, Shield, Navigation, ExternalLink, Home } from 'lucide-react';
import { propertyTypeConfig, formatPrice } from '@/lib/utils';
import { getDirectionsUrl } from '@/lib/geo';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { toggleFavorite, checkFavorite } from '@/actions/favorites';

const ExploreMap = dynamic(() => import('@/components/maps/ExploreMap'), { ssr: false });

export default function PropertyDetailClient({ id }: { id: string }) {
  const [property, setProperty] = useState<any>(null);
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
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        setProperty(data.property);
        const fav = await checkFavorite(undefined, id);
        setIsFavorite(fav);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: property.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const handleFavorite = async () => {
    const res = await toggleFavorite(undefined, id);
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

  if (!property) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontFamily: 'Outfit', marginBottom: '12px' }}>Property not found</h2>
        <Link href="/stays" className="btn-primary">Browse Stays</Link>
      </div>
    );
  }

  const typeInfo = propertyTypeConfig[property.propertyType] || { label: property.propertyType, icon: '🏠' };
  const images = property.images?.length > 0
    ? property.images.map((img: any) => img.imageUrl)
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'];

  return (
    <div>
      {/* Image Gallery */}
      <div style={{ position: 'relative', height: '50vh', minHeight: '360px', overflow: 'hidden' }}>
        <img src={images[activeImage]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,14,26,0.9) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)' }} />

        <Link href="/stays" style={{
          position: 'absolute', top: '24px', left: '24px',
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-full)', color: 'white', fontSize: '0.9rem',
        }}>
          <ChevronLeft size={18} /> Back
        </Link>

        {images.length > 1 && (
          <div style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
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

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 24px' }}>
          <div className="page-container">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px',
                borderRadius: 'var(--radius-full)', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '0.85rem',
              }}>{typeInfo.icon} {typeInfo.label}</span>
              {property.verificationStatus === 'APPROVED' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 14px',
                  borderRadius: 'var(--radius-full)', background: 'rgba(20,184,166,0.2)', color: '#14b8a6', fontSize: '0.85rem',
                }}><Shield size={12} /> Verified</span>
              )}
            </div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '8px' }}>
              {property.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                <MapPin size={16} /> {property.city}, {property.state}
              </span>
              {property.ratingAvg > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 600 }}>
                  <Star size={16} fill="#fbbf24" /> {property.ratingAvg.toFixed(1)} ({property.reviewCount} reviews)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container" style={{ padding: '40px 24px 80px' }}>
        <div className="property-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
          <div style={{ minWidth: 0 }}>
            {/* Price + Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--primary)' }}>
                  {formatPrice(property.pricePerNight)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}> / night</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={getDirectionsUrl(property.latitude, property.longitude, property.title)} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
                  <Navigation size={16} /> Directions
                </a>
                <button onClick={handleShare} className="btn-secondary" style={{ padding: '10px 16px' }}><Share2 size={16} /></button>
                <button onClick={handleFavorite} className="btn-secondary" style={{ padding: '10px 16px', ...(isFavorite ? { color: '#ef4444', borderColor: '#ef4444' } : {}) }}>
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '28px' }}>
              {[
                { icon: Users, label: 'Guests', value: `Up to ${property.maxGuests}` },
                { icon: DoorOpen, label: 'Bedrooms', value: property.bedrooms },
                { icon: Bed, label: 'Beds', value: property.beds },
                { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                  <s.icon size={20} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit' }}>{s.value}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>About this property</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>Amenities</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                  {property.amenities.map((a: any) => (
                    <div key={a.amenityId} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-secondary)',
                    }}>
                      ✓ {a.amenity?.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            {property.houseRules && (
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>House Rules</h2>
                <div className="glass-card" style={{ padding: '20px' }}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{property.houseRules}</p>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 600 }}>Reviews</h2>
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  Write Review
                </button>
              </div>

              {showReviewForm && (
                <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setReviewRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                        <Star size={24} fill={s <= reviewRating ? '#fbbf24' : 'transparent'} style={{ color: s <= reviewRating ? '#fbbf24' : 'var(--text-muted)' }} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} className="input-field" placeholder="Share your experience..." style={{ minHeight: '100px', resize: 'vertical', marginBottom: '12px' }} />
                  <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 24px' }}>Submit Review</button>
                </div>
              )}

              {property.reviews?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {property.reviews.map((review: any) => (
                    <div key={review.id} className="glass-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                            {review.user?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{review.user?.name}</p>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={12} fill={s <= review.rating ? '#fbbf24' : 'transparent'} style={{ color: s <= review.rating ? '#fbbf24' : 'var(--text-muted)' }} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
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
            {/* Owner Info */}
            {property.owner && (
              <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Hosted by</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 600 }}>
                    {property.owner.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{property.owner.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Member since {new Date(property.owner.createdAt).getFullYear()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Map */}
            <div className="glass-card" style={{ height: '250px', overflow: 'hidden', marginBottom: '20px' }}>
              <ExploreMap places={[{ ...property, name: property.title, category: property.propertyType }]} />
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Coordinates</p>
              <p style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}</p>
              <a href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontSize: '0.85rem', marginTop: '8px' }}>
                Open in Google Maps <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .property-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
