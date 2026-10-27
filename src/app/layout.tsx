import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'LetsVisit — Discover Places, Stay Local, Explore Better',
  description: 'Discover amazing places, hidden gems, local stays, picnic spots, museums and everything you need to explore your destination. Find nearby attractions, homestays, and plan your trip.',
  keywords: 'travel, discovery, local stays, homestay, tourism, explore, attractions, India travel, trip planner',
  openGraph: {
    title: 'LetsVisit — Discover Places, Stay Local, Explore Better',
    description: 'Find amazing places, hidden gems, local stays, and plan your entire trip on one platform.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="main-content" style={{ minHeight: '100vh', paddingTop: '72px' }}>
            {children}
          </main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
