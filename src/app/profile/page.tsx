'use client';

import { useSession } from 'next-auth/react';
import { Mail, Shield, Phone, Edit2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { updateProfile } from '@/actions/users';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!session) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ fontFamily: 'Outfit', marginBottom: '12px' }}>Please sign in</h2>
        <Link href="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  const handleEditClick = () => {
    setName(session.user.name || '');
    // NextAuth session doesn't include phone by default unless added to JWT/session callbacks,
    // so it might be empty here. The user can just type it in and save it to DB.
    setPhone((session.user as any).phone || ''); 
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);

    const res = await updateProfile(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      // Update client-side session data
      await update({ name, phone });
    }
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px', maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700, marginBottom: '32px' }}>
        My <span className="gradient-text">Profile</span>
      </h1>

      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--gradient-accent)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700,
            }}>
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 600 }}>{session.user.name}</h2>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '4px 12px', borderRadius: 'var(--radius-full)',
                background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)',
                fontSize: '0.8rem', fontWeight: 500, marginTop: '4px',
              }}>
                <Shield size={12} /> {(session.user as any).role || 'TOURIST'}
              </span>
            </div>
          </div>

          {!isEditing && (
            <button onClick={handleEditClick} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              <Edit2 size={14} style={{ marginRight: '6px' }} /> Edit
            </button>
          )}
        </div>

        {error && <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
        {success && <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.9rem' }}>{success}</div>}

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
                style={{
                  width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)', outline: 'none'
                }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="+1 234 567 890"
                style={{
                  width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)', outline: 'none'
                }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '10px 24px' }}>
                {loading ? 'Saving...' : <><Check size={16} style={{ marginRight: '6px' }} /> Save Changes</>}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '10px 24px' }}>
                <X size={16} style={{ marginRight: '6px' }} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</p>
                <p style={{ fontSize: '0.95rem' }}>{session.user.email}</p>
              </div>
            </div>
            
            {(session.user as any).phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <Phone size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone Number</p>
                  <p style={{ fontSize: '0.95rem' }}>{(session.user as any).phone}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
          <Link href="/favorites" className="btn-secondary" style={{ fontSize: '0.9rem' }}>❤️ Favorites</Link>
          <Link href="/trip-planner" className="btn-secondary" style={{ fontSize: '0.9rem' }}>🗺️ My Trips</Link>
          {(session.user as any).role === 'PROPERTY_OWNER' && (
            <Link href="/owner" className="btn-secondary" style={{ fontSize: '0.9rem' }}>🏠 My Properties</Link>
          )}
        </div>
      </div>
    </div>
  );
}
