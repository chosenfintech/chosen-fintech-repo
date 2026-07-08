// src/app/events/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogPageServer from '@/components/events/EventsPageServer';
import EventsPageSkeleton from '@/components/events/EventsPageSkeleton';
import ListQueryMemory from '@/components/ListQueryMemory';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Stay up to date with the latest events, workshops, and community meetups organised by Chosen Fintech Solutions across Ghana and Africa.',
  alternates: {
    canonical: `${baseUrl}/events`,
  },
  openGraph: {
    title: 'Events — Chosen Fintech Solutions',
    description:
      'Discover upcoming and past events, workshops, and community meetups from Chosen Fintech Solutions — bringing blockchain education and fintech innovation to Ghana and across Africa.',
    url: `${baseUrl}/events`,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image-events.png',
        width: 1200,
        height: 630,
        alt: 'Chosen Fintech Solutions Events',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events — Chosen Fintech Solutions',
    description:
      'Browse upcoming and past events, workshops, and community meetups from Chosen Fintech Solutions across Ghana and Africa.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image-events.png'],
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    categoryId?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <>
      <Suspense fallback={null}>
        <ListQueryMemory />
      </Suspense>
      <Suspense fallback={<EventsPageSkeleton />}>
        <BlogPageServer searchParams={resolvedSearchParams} />
      </Suspense>
    </>
  );
}
