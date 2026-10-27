'use client';

import dynamic from 'next/dynamic';
import { MapIcon } from 'lucide-react';

const ExploreMap = dynamic(() => import('@/components/maps/ExploreMap'), { ssr: false });

export default function GlobalMapClient({ places }: { places: any[] }) {
  if (places.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        <MapIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p>No map data available</p>
      </div>
    );
  }

  return <ExploreMap places={places} />;
}
