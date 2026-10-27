import PropertyDetailClient from '@/components/place/PropertyDetailClient';

export const metadata = { title: 'Property Details — LetsVisit' };

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyDetailClient id={id} />;
}
