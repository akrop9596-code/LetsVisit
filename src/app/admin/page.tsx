'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Building, MapPin, Star, Flag, BarChart3, TrendingUp, Loader2, Check, X, Eye, EyeOff, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getAdminStats, getAdminUsers, getAdminProperties, getAdminPlaces, getAdminReviews, updatePropertyVerification, toggleUserActive } from '@/actions/admin';
import { propertyTypeConfig, categoryConfig, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'properties', label: 'Properties', icon: Building },
  { id: 'places', label: 'Places', icon: MapPin },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px', fontSize: '0.8rem',
  color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)',
};
const tdStyle: React.CSSProperties = {
  padding: '12px 16px', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)',
  color: 'var(--text-secondary)',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const data = await getAdminStats();
        if (data.error) {
          toast.error(data.error);
        } else {
          setStats(data);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    loadStats();
  }, []);

  useEffect(() => {
    async function loadTabData() {
      setTabLoading(true);
      try {
        if (activeTab === 'users' && users.length === 0) {
          const data = await getAdminUsers();
          setUsers(data);
        }
        if (activeTab === 'properties' && properties.length === 0) {
          const data = await getAdminProperties();
          setProperties(data);
        }
        if (activeTab === 'places' && places.length === 0) {
          const data = await getAdminPlaces();
          setPlaces(data);
        }
        if (activeTab === 'reviews' && reviews.length === 0) {
          const data = await getAdminReviews();
          setReviews(data);
        }
      } catch (e) { console.error(e); }
      setTabLoading(false);
    }
    if (activeTab !== 'overview') loadTabData();
  }, [activeTab]);

  const handleVerification = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const result = await updatePropertyVerification(id, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Property ${status.toLowerCase()}`);
      setProperties(prev => prev.map(p => p.id === id ? { ...p, verificationStatus: status } : p));
    }
  };

  const handleToggleUser = async (id: string) => {
    const result = await toggleUserActive(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.isActive ? 'User activated' : 'User deactivated');
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: result.isActive } : u));
    }
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      ADMIN: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
      PROPERTY_OWNER: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
      TOURIST: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    };
    const c = colors[role] || colors.TOURIST;
    return (
      <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', background: c.bg, color: c.color, fontSize: '0.75rem', fontWeight: 600 }}>
        {role.replace('_', ' ')}
      </span>
    );
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      APPROVED: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
      PENDING: { bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
      REJECTED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
    };
    const c = colors[status] || colors.PENDING;
    return (
      <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', background: c.bg, color: c.color, fontSize: '0.75rem', fontWeight: 600 }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)',
        padding: '24px 12px', flexShrink: 0, position: 'sticky', top: '72px', height: 'calc(100vh - 72px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 12px' }}>
          <Shield size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 700 }}>Admin Panel</h2>
        </div>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '12px 16px', borderRadius: 'var(--radius-md)', border: 'none',
            background: activeTab === tab.id ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeTab === tab.id ? 600 : 400,
            transition: 'all 0.2s', marginBottom: '4px', textAlign: 'left',
          }}>
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px' }}>
        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 700, marginBottom: '28px' }}>
              Dashboard <span className="gradient-text">Overview</span>
            </h1>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <Loader2 size={40} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : stats ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                  {[
                    { label: 'Total Users', value: stats.users, icon: Users, color: '#3b82f6' },
                    { label: 'Properties', value: stats.properties, icon: Building, color: '#22c55e' },
                    { label: 'Places', value: stats.places, icon: MapPin, color: '#f97316' },
                    { label: 'Reviews', value: stats.reviews, icon: Star, color: '#fbbf24' },
                    { label: 'Reports', value: stats.reports, icon: Flag, color: '#ef4444' },
                    { label: 'Pending Verification', value: stats.pendingProperties, icon: TrendingUp, color: '#a855f7' },
                  ].map((s) => (
                    <div key={s.label} className="glass-card" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '12px',
                          background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <s.icon size={22} style={{ color: s.color }} />
                        </div>
                      </div>
                      <p style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700, marginBottom: '2px' }}>{s.value}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {[
                      { label: 'Manage Users', tab: 'users', icon: Users, color: '#3b82f6' },
                      { label: 'Verify Properties', tab: 'properties', icon: Building, color: '#22c55e' },
                      { label: 'View Places', tab: 'places', icon: MapPin, color: '#f97316' },
                      { label: 'View Reviews', tab: 'reviews', icon: Star, color: '#fbbf24' },
                    ].map(a => (
                      <button key={a.tab} onClick={() => setActiveTab(a.tab)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', background: `${a.color}10`, border: `1px solid ${a.color}30`,
                        borderRadius: 'var(--radius-md)', cursor: 'pointer', color: a.color,
                        fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s',
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><a.icon size={16} /> {a.label}</span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Shield size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>Admin access required</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>User Management</h1>
            {tabLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : users.length > 0 ? (
              <div className="glass-card" style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Reviews</th>
                      <th style={thStyle}>Joined</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ transition: 'background 0.2s' }}>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</td>
                        <td style={tdStyle}>{u.email}</td>
                        <td style={tdStyle}>{roleBadge(u.role)}</td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                            background: u.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            color: u.isActive ? '#22c55e' : '#ef4444',
                          }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td style={tdStyle}>{u._count?.reviews || 0}</td>
                        <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={tdStyle}>
                          <button onClick={() => handleToggleUser(u.id)} title={u.isActive ? 'Deactivate' : 'Activate'} style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                            color: u.isActive ? '#ef4444' : '#22c55e',
                          }}>
                            {u.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>Property Verification</h1>
            {tabLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : properties.length > 0 ? (
              <div className="glass-card" style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Title</th>
                      <th style={thStyle}>Type</th>
                      <th style={thStyle}>Owner</th>
                      <th style={thStyle}>City</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(p => {
                      const typeInfo = propertyTypeConfig[p.propertyType] || { label: p.propertyType, icon: '🏠' };
                      return (
                        <tr key={p.id}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>
                            <Link href={`/property/${p.id}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {p.title} <ChevronRight size={12} />
                            </Link>
                          </td>
                          <td style={tdStyle}>{typeInfo.icon} {typeInfo.label}</td>
                          <td style={tdStyle}>{p.owner?.name}</td>
                          <td style={tdStyle}>{p.city}</td>
                          <td style={tdStyle}>{formatPrice(p.pricePerNight)}</td>
                          <td style={tdStyle}>{statusBadge(p.verificationStatus)}</td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {p.verificationStatus !== 'APPROVED' && (
                                <button onClick={() => handleVerification(p.id, 'APPROVED')} title="Approve" style={{
                                  background: 'rgba(34,197,94,0.15)', border: 'none', borderRadius: '6px',
                                  padding: '6px', cursor: 'pointer', color: '#22c55e',
                                }}><Check size={14} /></button>
                              )}
                              {p.verificationStatus !== 'REJECTED' && (
                                <button onClick={() => handleVerification(p.id, 'REJECTED')} title="Reject" style={{
                                  background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '6px',
                                  padding: '6px', cursor: 'pointer', color: '#ef4444',
                                }}><X size={14} /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Building size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>No properties to verify</p>
              </div>
            )}
          </div>
        )}

        {/* Places Tab */}
        {activeTab === 'places' && (
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>Places Management</h1>
            {tabLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : places.length > 0 ? (
              <div className="glass-card" style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>City</th>
                      <th style={thStyle}>Rating</th>
                      <th style={thStyle}>Reviews</th>
                      <th style={thStyle}>Featured</th>
                      <th style={thStyle}>Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {places.map(p => {
                      const cat = categoryConfig[p.category] || { label: p.category, icon: '📍', color: '#3b82f6' };
                      return (
                        <tr key={p.id}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>
                            <Link href={`/place/${p.id}`} style={{ color: 'inherit' }}>{p.name}</Link>
                          </td>
                          <td style={tdStyle}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {cat.icon} {cat.label}
                            </span>
                          </td>
                          <td style={tdStyle}>{p.city}, {p.state}</td>
                          <td style={tdStyle}>
                            {p.ratingAvg > 0 && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                                <Star size={12} fill="#fbbf24" /> {p.ratingAvg.toFixed(1)}
                              </span>
                            )}
                          </td>
                          <td style={tdStyle}>{p.reviewCount}</td>
                          <td style={tdStyle}>{p.isFeatured ? '⭐' : '—'}</td>
                          <td style={tdStyle}>
                            <span style={{
                              padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem',
                              background: p.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                              color: p.isActive ? '#22c55e' : '#ef4444',
                            }}>{p.isActive ? 'Yes' : 'No'}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <MapPin size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>No places found</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>Reviews</h1>
            {tabLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : reviews.length > 0 ? (
              <div className="glass-card" style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>User</th>
                      <th style={thStyle}>Target</th>
                      <th style={thStyle}>Rating</th>
                      <th style={thStyle}>Review</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => (
                      <tr key={r.id}>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{r.user?.name}</td>
                        <td style={tdStyle}>{r.place?.name || r.property?.title || '—'}</td>
                        <td style={tdStyle}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={12} fill={s <= r.rating ? '#fbbf24' : 'transparent'} style={{ color: s <= r.rating ? '#fbbf24' : 'var(--text-muted)' }} />
                            ))}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, maxWidth: '300px' }}>
                          <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reviewText}</p>
                        </td>
                        <td style={tdStyle}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Star size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>No reviews yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
