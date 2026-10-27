import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import DestinationsSection from '@/components/home/DestinationsSection';
import GlobalMapSection from '@/components/home/GlobalMapSection';
import LocalStaysCTA from '@/components/home/LocalStaysCTA';
import FeaturesSection from '@/components/home/FeaturesSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <GlobalMapSection />
      <DestinationsSection />
      <FeaturesSection />
      <LocalStaysCTA />
    </>
  );
}
