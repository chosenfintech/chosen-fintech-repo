// src/components/home/LatestEventsServer.tsx
import { LatestEvents } from './LatestEvents';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function fetchLatestEvents(): Promise<IPost[]> {
  try {
    const url = new URL('/api/posts/events', baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '3');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }, // revalidate every hour
    });

    if (!response.ok) return [];

    const result: IPostsPaginatedResponse = await response.json();
    const posts = result.data ?? [];

    return posts;
  } catch (error) {
    console.error('Failed to fetch latest events:', error);
    return [];
  }
}

export default async function LatestEventsServer() {
  const posts = await fetchLatestEvents();
  return <LatestEvents posts={posts} />;
}
