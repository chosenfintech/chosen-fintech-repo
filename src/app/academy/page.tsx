// src/app/academy/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import AcademyPageServer from '@/components/academy/AcademyPageServer';
import BlogPageSkeleton from '@/components/posts/BlogPageSkeleton';

export const metadata: Metadata = {
  title: 'Academy',
  description:
    'Explore educational guides and the latest blog posts from our team.',
};

interface AcademyPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function AcademyPage({
  searchParams,
}: AcademyPageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <AcademyPageServer searchParams={resolvedSearchParams} />
    </Suspense>
  );
}