import PlaceDetailClient from '@/components/place/PlaceDetailClient';

export const metadata = { title: 'Place Details — LetsVisit' };

export default async function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlaceDetailClient id={id} />;
}
