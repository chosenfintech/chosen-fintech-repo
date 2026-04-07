// app/blog/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogPageServer from '@/components/blog/BlogPageServer';
import BlogPageSkeleton from '@/components/posts/BlogPageSkeleton';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest articles, guides, and insights from our team.',
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
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageServer searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
