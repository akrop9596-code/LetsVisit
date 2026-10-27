'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Building, Upload, Plus, X, MapPin, DollarSign, Users, Bed, Bath, DoorOpen, FileText, CheckCircle } from 'lucide-react';
import { createProperty } from '@/actions/properties';
import { propertyTypeConfig } from '@/lib/utils';
import toast from 'react-hot-toast';

const amenityList = [
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'parking', name: 'Parking', icon: '🅿️' },
  { id: 'ac', name: 'Air Conditioning', icon: '❄️' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'pool', name: 'Swimming Pool', icon: '🏊' },
  { id: 'gym', name: 'Gym', icon: '🏋️' },
  { id: 'tv', name: 'TV', icon: '📺' },
  { id: 'washer', name: 'Washer', icon: '🧺' },
  { id: 'heater', name: 'Room Heater', icon: '🔥' },
  { id: 'hot-water', name: 'Hot Water', icon: '🚿' },
  { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
  { id: 'pets', name: 'Pet Friendly', icon: '🐾' },
  { id: 'security', name: '24/7 Security', icon: '🔒' },
  { id: 'power-backup', name: 'Power Backup', icon: '🔋' },
  { id: 'garden', name: 'Garden', icon: '🌳' },
  { id: 'balcony', name: 'Balcony', icon: '🏗️' },
];

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    selectedAmenities.forEach(id => formData.append('amenityIds', id));
    imageUrls.filter(u => u.trim()).forEach(url => formData.append('imageUrls', url));

    const result = await createProperty(formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Property listed successfully!');
      router.push('/owner');
    }
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '32px',
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px',
    display: 'flex', alignItems: 'center', gap: '8px',
  };
  const fieldGroupStyle: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 500,
  };

  return (
    <div className="page-container" style={{ padding: '32px 24px 80px', maxWidth: '900px' }}>
      <Link href="/owner" style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px',
      }}>
        <ChevronLeft size={18} /> Back to Dashboard
      </Link>

      <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
        <Building size={28} style={{ color: 'var(--primary)', display: 'inline', marginRight: '8px' }} />
        List Your <span className="gradient-text">Property</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '36px' }}>Fill in the details below to list your property on LetsVisit</p>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="glass-card" style={{ padding: '28px', ...sectionStyle }}>
          <h2 style={sectionTitleStyle}><FileText size={20} style={{ color: 'var(--primary)' }} /> Basic Information</h2>
          <div style={fieldGroupStyle}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Property Title *</label>
              <input name="title" className="input-field" placeholder="e.g., Cozy Lakeside Villa in Udaipur" required />
            </div>
            <div>
              <label style={labelStyle}>Property Type *</label>
              <select name="propertyType" className="input-field" required style={{ cursor: 'pointer' }}>
                {Object.entries(propertyTypeConfig).map(([key, val]) => (
                  <option key={key} value={key}>{val.icon} {val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price per Night (₹) *</label>
              <input name="pricePerNight" type="number" className="input-field" placeholder="1500" min={1} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description *</label>
              <textarea name="description" className="input-field" placeholder="Describe your property, its atmosphere, surroundings, and what makes it special..." rows={4} style={{ resize: 'vertical', minHeight: '100px' }} required />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="glass-card" style={{ padding: '28px', ...sectionStyle }}>
          <h2 style={sectionTitleStyle}><MapPin size={20} style={{ color: '#14b8a6' }} /> Location</h2>
          <div style={fieldGroupStyle}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Street Address *</label>
              <input name="address" className="input-field" placeholder="e.g., 42 Lake Palace Road" required />
            </div>
            <div>
              <label style={labelStyle}>City *</label>
              <input name="city" className="input-field" placeholder="e.g., Udaipur" required />
            </div>
            <div>
              <label style={labelStyle}>State *</label>
              <input name="state" className="input-field" placeholder="e.g., Rajasthan" required />
            </div>
            <div>
              <label style={labelStyle}>Latitude *</label>
              <input name="latitude" type="number" step="any" className="input-field" placeholder="24.5854" required />
            </div>
            <div>
              <label style={labelStyle}>Longitude *</label>
              <input name="longitude" type="number" step="any" className="input-field" placeholder="73.6835" required />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            💡 Tip: Find coordinates on Google Maps by right-clicking on the location
          </p>
        </div>

        {/* Room Details */}
        <div className="glass-card" style={{ padding: '28px', ...sectionStyle }}>
          <h2 style={sectionTitleStyle}><Bed size={20} style={{ color: '#a855f7' }} /> Room Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <label style={labelStyle}><Users size={14} style={{ display: 'inline', marginRight: '4px' }} /> Max Guests *</label>
              <input name="maxGuests" type="number" className="input-field" defaultValue={2} min={1} max={50} required />
            </div>
            <div>
              <label style={labelStyle}><DoorOpen size={14} style={{ display: 'inline', marginRight: '4px' }} /> Bedrooms</label>
              <input name="bedrooms" type="number" className="input-field" defaultValue={1} min={1} max={20} />
            </div>
            <div>
              <label style={labelStyle}><Bed size={14} style={{ display: 'inline', marginRight: '4px' }} /> Beds</label>
              <input name="beds" type="number" className="input-field" defaultValue={1} min={1} max={50} />
            </div>
            <div>
              <label style={labelStyle}><Bath size={14} style={{ display: 'inline', marginRight: '4px' }} /> Bathrooms</label>
              <input name="bathrooms" type="number" className="input-field" defaultValue={1} min={1} max={20} />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="glass-card" style={{ padding: '28px', ...sectionStyle }}>
          <h2 style={sectionTitleStyle}><CheckCircle size={20} style={{ color: '#22c55e' }} /> Amenities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
            {amenityList.map(a => (
              <button key={a.id} type="button" onClick={() => toggleAmenity(a.id)} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                border: `1px solid ${selectedAmenities.includes(a.id) ? 'var(--primary)' : 'var(--border-color)'}`,
                background: selectedAmenities.includes(a.id) ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255,255,255,0.04)',
                color: selectedAmenities.includes(a.id) ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '0.9rem', transition: 'all 0.2s', fontWeight: selectedAmenities.includes(a.id) ? 600 : 400,
              }}>
                <span>{a.icon}</span> {a.name}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="glass-card" style={{ padding: '28px', ...sectionStyle }}>
          <h2 style={sectionTitleStyle}><Upload size={20} style={{ color: '#06b6d4' }} /> Property Images</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {imageUrls.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  value={url}
                  onChange={e => {
                    const updated = [...imageUrls];
                    updated[i] = e.target.value;
                    setImageUrls(updated);
                  }}
                  className="input-field"
                  placeholder="https://images.unsplash.com/..."
                  style={{ flex: 1 }}
                />
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))} style={{
                    background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 'var(--radius-md)',
                    padding: '10px', cursor: 'pointer', color: '#ef4444',
                  }}><X size={16} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)',
              background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem',
            }}><Plus size={16} /> Add Image URL</button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Paste Unsplash or any public image URLs. First image will be the cover.
          </p>
        </div>

        {/* House Rules */}
        <div className="glass-card" style={{ padding: '28px', ...sectionStyle }}>
          <h2 style={sectionTitleStyle}>📋 House Rules</h2>
          <textarea name="houseRules" className="input-field" placeholder="e.g., No smoking indoors. Quiet hours 10 PM – 7 AM. Pets allowed on request." rows={3} style={{ resize: 'vertical' }} />
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Link href="/owner" className="btn-secondary" style={{ padding: '12px 28px' }}>Cancel</Link>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 36px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Submitting...' : '🏡 List Property'}
          </button>
        </div>
      </form>

      <style jsx>{`
        @media (max-width: 600px) {
          form div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
