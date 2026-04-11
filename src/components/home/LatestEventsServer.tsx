import { LatestEvents } from './LatestEvents';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const EXCLUDED_CATEGORIES = ['education', 'blog'];

async function fetchLatestEvents(): Promise<IPost[]> {
  try {
    const url = new URL('/api/posts', baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '10');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }, // revalidate every hour
    });

    if (!response.ok) return [];

    const result: IPostsPaginatedResponse = await response.json();
    const posts = result.data ?? [];

    return posts
      .filter(
        (post) =>
          !post.category ||
          !EXCLUDED_CATEGORIES.includes(post.category.name.toLowerCase()),
      )
      .slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch latest events:', error);
    return [];
  }
}

export default async function LatestEventsServer() {
  const posts = await fetchLatestEvents();
  return <LatestEvents posts={posts} />;
}
