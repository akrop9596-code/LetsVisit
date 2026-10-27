'use client';

import { useState, useEffect } from 'react';
import { Map, Plus, Calendar, MapPin, Trash2, Loader2, AlertTriangle, Clock, Navigation } from 'lucide-react';
import Link from 'next/link';
import { createTrip, getTrips, deleteTrip } from '@/actions/trips';
import toast from 'react-hot-toast';

export default function TripPlannerPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTrip, setNewTrip] = useState({ name: '', destination: '', startDate: '', endDate: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleCreate = async () => {
    if (!newTrip.name || !newTrip.destination) {
      toast.error('Trip name and destination are required');
      return;
    }
    setCreating(true);
    const result = await createTrip(newTrip);
    if (result.error) {
      toast.error(result.error);
    } else if (result.trip) {
      toast.success('Trip created!');
      setTrips(prev => [{ ...result.trip, places: [] }, ...prev]);
      setNewTrip({ name: '', destination: '', startDate: '', endDate: '' });
      setShowCreate(false);
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTrip(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Trip deleted');
      setTrips(prev => prev.filter(t => t.id !== id));
    }
    setDeleteId(null);
  };

  const formatDate = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return null;
    const diff = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    return `${diff} day${diff !== 1 ? 's' : ''}`;
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
            <span className="gradient-text">Trip Planner</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Plan your perfect trip day by day</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={18} /> New Trip
        </button>
      </div>

      {showCreate && (
        <div className="glass-card animate-fade-in-up" style={{ padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>Create New Trip</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Trip Name *</label>
              <input className="input-field" placeholder="e.g., Jaipur Weekend" value={newTrip.name}
                onChange={(e) => setNewTrip({...newTrip, name: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Destination *</label>
              <input className="input-field" placeholder="e.g., Jaipur" value={newTrip.destination}
                onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Start Date</label>
              <input className="input-field" type="date" value={newTrip.startDate}
                onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>End Date</label>
              <input className="input-field" type="date" value={newTrip.endDate}
                onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={() => { setShowCreate(false); setNewTrip({ name: '', destination: '', startDate: '', endDate: '' }); }} className="btn-secondary">Cancel</button>
            <button onClick={handleCreate} className="btn-primary" disabled={creating} style={{ opacity: creating ? 0.7 : 1 }}>
              {creating ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 size={40} style={{ color: 'var(--primary)', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading trips...</p>
          <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', marginBottom: '8px' }}>No trips planned yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Create your first trip and start adding places to your itinerary</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus size={18} /> Create Trip</button>
        </div>
      ) : !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {trips.map((trip: any) => {
            const placeCount = trip.places?.length || 0;
            const duration = getDuration(trip.startDate, trip.endDate);

            return (
              <div key={trip.id} className="glass-card glass-card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 600, marginBottom: '10px' }}>{trip.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)' }} /> {trip.destination}
                    </span>
                    {trip.startDate && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} style={{ color: '#14b8a6' }} /> {formatDate(trip.startDate)}{trip.endDate ? ` — ${formatDate(trip.endDate)}` : ''}
                      </span>
                    )}
                    {duration && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} style={{ color: '#a855f7' }} /> {duration}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Navigation size={14} style={{ color: '#3b82f6' }} /> {placeCount} place{placeCount !== 1 ? 's' : ''} added
                    </span>
                  </div>

                  {/* Show places if any */}
                  {trip.places?.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {trip.places.slice(0, 4).map((tp: any) => (
                        <Link key={tp.id} href={`/place/${tp.placeId}`} style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                          background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)',
                        }}>
                          {tp.place?.images?.[0]?.imageUrl && (
                            <img src={tp.place.images[0].imageUrl} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />
                          )}
                          {tp.place?.name || 'Place'}
                        </Link>
                      ))}
                      {trip.places.length > 4 && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '4px 8px' }}>
                          +{trip.places.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/explore?city=${encodeURIComponent(trip.destination)}`} className="btn-secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '8px' }}>
                    Add Places
                  </Link>
                  {deleteId === trip.id ? (
                    <>
                      <button onClick={() => handleDelete(trip.id)} style={{
                        fontSize: '0.8rem', padding: '8px 12px', background: 'rgba(239,68,68,0.15)',
                        color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        <AlertTriangle size={14} /> Confirm
                      </button>
                      <button onClick={() => setDeleteId(null)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px' }}>✕</button>
                    </>
                  ) : (
                    <button onClick={() => setDeleteId(trip.id)} className="btn-secondary" style={{ padding: '8px 12px', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
