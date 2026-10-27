'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { categoryConfig, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Star, Navigation } from 'lucide-react';
import { getDirectionsUrl } from '@/lib/geo';

interface Place {
  id: string;
  name: string;
  category: string;
  city: string;
  latitude: number;
  longitude: number;
  ratingAvg: number;
  entryFee?: number | null;
  images?: { imageUrl: string }[];
}

function createCategoryIcon(category: string) {
  const cat = categoryConfig[category] || { icon: '📍', color: '#94a3b8' };
  return L.divIcon({
    className: '',
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);background:${cat.color};
      border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);
    "><span style="transform:rotate(45deg);font-size:16px">${cat.icon}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

function MapBoundsUpdater({ places }: { places: Place[] }) {
  const map = useMap();
  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [places, map]);
  return null;
}

export default function ExploreMap({ places }: { places: Place[] }) {
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const center = places.length > 0 
    ? [places[0].latitude, places[0].longitude] as [number, number] 
    : defaultCenter;

  const icons = useMemo(() => {
    const cache: Record<string, L.DivIcon> = {};
    return (category: string) => {
      if (!cache[category]) cache[category] = createCategoryIcon(category);
      return cache[category];
    };
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsUpdater places={places} />
      {places.map((place) => (
        <Marker key={place.id} position={[place.latitude, place.longitude]} icon={icons(place.category)}>
          <Popup maxWidth={280} minWidth={220}>
            <div style={{ fontFamily: 'Inter, sans-serif' }}>
              {place.images?.[0] && (
                <img src={place.images[0].imageUrl} alt={place.name} style={{
                  width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px',
                }} />
              )}
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', color: '#f1f5f9' }}>{place.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '999px', background: `${categoryConfig[place.category]?.color || '#666'}20`, color: categoryConfig[place.category]?.color || '#94a3b8' }}>
                  {categoryConfig[place.category]?.label || place.category}
                </span>
                {place.ratingAvg > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', color: '#fbbf24' }}>
                    <Star size={12} fill="#fbbf24" /> {place.ratingAvg.toFixed(1)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href={`/place/${place.id}`} style={{
                  flex: 1, padding: '6px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 500,
                  background: '#f97316', color: 'white', borderRadius: '8px', textDecoration: 'none',
                }}>View Details</Link>
                <a href={getDirectionsUrl(place.latitude, place.longitude, place.name)} target="_blank"
                  rel="noopener noreferrer" style={{
                  padding: '6px 10px', fontSize: '0.8rem', background: '#14b8a6', color: 'white',
                  borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <Navigation size={12} /> Go
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
