'use client';

import { useState, useEffect } from 'react';
import { Building, Plus, Edit, Trash2, Eye, EyeOff, Star, BarChart3, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { getOwnerProperties, deleteProperty, togglePropertyActive } from '@/actions/properties';
import { formatPrice, propertyTypeConfig } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getOwnerProperties();
        setProperties(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await deleteProperty(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Property deleted');
      setProperties(prev => prev.filter(p => p.id !== id));
    }
    setDeleteId(null);
  };

  const handleToggle = async (id: string) => {
    const result = await togglePropertyActive(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      setProperties(prev => prev.map(p => p.id === id ? { ...p, isActive: result.isActive } : p));
      toast.success(result.isActive ? 'Property activated' : 'Property deactivated');
    }
  };

  // Stats
  const totalListings = properties.length;
  const activeCount = properties.filter(p => p.isActive).length;
  const avgRating = properties.length > 0
    ? (properties.reduce((sum, p) => sum + (p.ratingAvg || 0), 0) / properties.length).toFixed(1)
    : '0.0';
  const totalReviews = properties.reduce((sum, p) => sum + (p._count?.reviews || 0), 0);

  const verificationColors: Record<string, { bg: string; color: string }> = {
    APPROVED: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    PENDING: { bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
    REJECTED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
            <Building size={28} style={{ color: 'var(--primary)', display: 'inline', marginRight: '8px' }} />
            Owner <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your property listings</p>
        </div>
        <Link href="/owner/add" className="btn-primary">
          <Plus size={18} /> Add Property
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Listings', value: totalListings.toString(), icon: Building, color: '#3b82f6' },
          { label: 'Active', value: activeCount.toString(), icon: Eye, color: '#22c55e' },
          { label: 'Avg Rating', value: avgRating, icon: Star, color: '#fbbf24' },
          { label: 'Total Reviews', value: totalReviews.toString(), icon: BarChart3, color: '#a855f7' },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.label}</p>
                <p style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 700 }}>{s.value}</p>
              </div>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 size={40} className="spin" style={{ color: 'var(--primary)', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading properties...</p>
          <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Properties List */}
      {!loading && properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏡</div>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', marginBottom: '8px' }}>No properties listed yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Start listing your property to earn from travelers</p>
          <Link href="/owner/add" className="btn-primary"><Plus size={18} /> List Property</Link>
        </div>
      ) : !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {properties.map(property => {
            const typeInfo = propertyTypeConfig[property.propertyType] || { label: property.propertyType, icon: '🏠' };
            const img = property.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=60';
            const vs = verificationColors[property.verificationStatus] || verificationColors.PENDING;

            return (
              <div key={property.id} className="glass-card" style={{ display: 'flex', overflow: 'hidden', gap: 0 }}>
                {/* Image */}
                <div style={{ width: '200px', minHeight: '180px', flexShrink: 0, position: 'relative' }}>
                  <img src={img} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {!property.isActive && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: '0.85rem' }}>Inactive</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span style={{ fontSize: '0.8rem', padding: '2px 10px', borderRadius: 'var(--radius-full)', background: vs.bg, color: vs.color }}>
                        {property.verificationStatus}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 600, marginBottom: '4px' }}>{property.title}</h3>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <MapPin size={14} /> {property.city}, {property.state}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit' }}>{formatPrice(property.pricePerNight)}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>/night</span></span>
                      {property.ratingAvg > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 600, fontSize: '0.9rem' }}>
                          <Star size={14} fill="#fbbf24" /> {property.ratingAvg.toFixed(1)} ({property._count?.reviews || 0})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <Link href={`/property/${property.id}`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                      <Eye size={14} /> View
                    </Link>
                    <button onClick={() => handleToggle(property.id)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                      {property.isActive ? <><EyeOff size={14} /> Deactivate</> : <><Eye size={14} /> Activate</>}
                    </button>
                    {deleteId === property.id ? (
                      <>
                        <button onClick={() => handleDelete(property.id)} style={{ fontSize: '0.8rem', padding: '6px 14px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={14} /> Confirm Delete
                        </button>
                        <button onClick={() => setDeleteId(null)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setDeleteId(property.id)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px', color: '#ef4444' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 640px) {
          .glass-card[style*="display: flex"][style*="overflow: hidden"] {
            flex-direction: column !important;
          }
          .glass-card[style*="display: flex"][style*="overflow: hidden"] > div:first-child {
            width: 100% !important;
            min-height: 160px !important;
          }
        }
      `}</style>
    </div>
  );
}
