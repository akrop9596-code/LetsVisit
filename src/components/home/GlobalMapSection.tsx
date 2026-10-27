import { prisma } from '@/lib/prisma';
import GlobalMapClient from './GlobalMapClient';

export default async function GlobalMapSection() {
  const places = await prisma.place.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
      city: true,
      latitude: true,
      longitude: true,
      ratingAvg: true,
      entryFee: true,
      images: { take: 1, select: { imageUrl: true } },
    },
  });

  return (
    <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
      <div className="page-container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Explore The <span className="gradient-text">World</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Discover top-rated destinations globally. Select a marker to view more details about each breathtaking location.
          </p>
        </div>

        <div className="glass-card" style={{ 
          height: '600px', 
          borderRadius: 'var(--radius-xl)', 
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <GlobalMapClient places={places} />
        </div>
      </div>
    </section>
  );
}
