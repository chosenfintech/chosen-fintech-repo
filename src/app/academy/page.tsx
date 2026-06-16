// src/app/academy/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/ui/PageHero';
import AcademyGuidesServer from '@/components/academy/AcademyGuidesServer';
import AcademyBlogsServer from '@/components/academy/AcademyBlogsServer';
import AcademyBlogsSkeleton from '@/components/academy/AcademyBlogsSkeleton';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

export const metadata: Metadata = {
  title: 'Academy',
  description:
    'Explore educational guides, tutorials, and the latest blog posts from Chosen Fintech Solutions — covering blockchain, Cardano, DeFi, financial literacy, and digital asset management.',
  alternates: {
    canonical: `${baseUrl}/academy`,
  },
  openGraph: {
    title: 'Academy — Chosen Fintech Solutions',
    description:
      'Level up your knowledge with the Chosen Fintech Academy — in-depth guides, tutorials, and articles on blockchain technology, Cardano, DeFi, and fintech education for beginners and experienced learners alike.',
    url: `${baseUrl}/academy`,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image-academy.png',
        width: 1200,
        height: 630,
        alt: 'Chosen Fintech Solutions Academy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academy — Chosen Fintech Solutions',
    description:
      'Discover educational guides and articles on blockchain, Cardano, DeFi, and financial literacy from the Chosen Fintech Solutions Academy.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image-academy.png'],
  },
};

interface AcademyPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
    guidePage?: string;
  }>;
}

export default async function AcademyPage({ searchParams }: AcademyPageProps) {
  const resolvedSearchParams = await searchParams;
  const guidePage = parseInt(resolvedSearchParams.guidePage || '1') || 1;

  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <PageHero title="Academy" />
      <Suspense fallback={null}>
        <AcademyGuidesServer guidePage={guidePage} />
      </Suspense>
      <Suspense fallback={<AcademyBlogsSkeleton />}>
        <AcademyBlogsServer searchParams={resolvedSearchParams} />
      </Suspense>
      <Footer />
    </main>
  );
}
