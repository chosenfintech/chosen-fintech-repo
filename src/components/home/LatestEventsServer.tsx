// src/components/home/LatestEventsServer.tsx
import { LatestEvents } from './LatestEvents';
import { IEvent, IEventsPaginatedResponse } from '@/types/events/event.types';
import { EVENTS_CACHE_TAG, POSTS_REVALIDATE_SECONDS } from '@/config/cache';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function fetchLatestEvents(): Promise<IEvent[]> {
  try {
    const url = new URL('/api/events/published', baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '3');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [EVENTS_CACHE_TAG] },
    });

    if (!response.ok) return [];

    const result: IEventsPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('Failed to fetch latest events:', error);
    return [];
  }
}

export default async function LatestEventsServer() {
  const events = await fetchLatestEvents();
  return <LatestEvents posts={events} />;
}
