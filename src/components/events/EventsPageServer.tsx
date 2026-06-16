// src/components/events/EventsPageServer.tsx
import EventsPageClient from './EventsPageClient';
import { IEvent, IEventsPaginatedResponse } from '@/types/events/event.types';
import { ICategoriesPaginatedResponse } from '@/types/events/category.types';
import {
  EVENTS_CACHE_TAG,
  EVENT_CATEGORIES_CACHE_TAG,
  POSTS_REVALIDATE_SECONDS,
} from '@/config/cache';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function fetchEvents(params: {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
}): Promise<IEventsPaginatedResponse> {
  const url = new URL(`/api/events/published`, baseUrl);
  url.searchParams.set('page', params.page.toString());
  url.searchParams.set('limit', params.limit.toString());
  if (params.categoryId) url.searchParams.set('categoryId', params.categoryId);
  if (params.search) url.searchParams.set('search', params.search);

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [EVENTS_CACHE_TAG] },
  });

  if (!response.ok) {
    console.error('Failed to fetch events');
    return {
      message: 'Error',
      data: [],
      meta: { total: 0, page: 1, limit: params.limit, totalPages: 1 },
    };
  }

  return response.json();
}

async function fetchLatestFeaturedEvent(): Promise<IEvent | null> {
  const url = new URL(`/api/events/published`, baseUrl);
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', '1');
  url.searchParams.set('isFeatured', 'true');

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [EVENTS_CACHE_TAG] },
  });

  if (!response.ok) {
    console.error('Failed to fetch featured event');
    return null;
  }

  const result = await response.json();
  return result?.data?.[0] ?? null;
}

async function fetchCategories(): Promise<ICategoriesPaginatedResponse> {
  try {
    const url = new URL(`/api/events/categories/published`, baseUrl);
    url.searchParams.set('limit', '1000');
    url.searchParams.set('sortBy', 'name');
    url.searchParams.set('sortOrder', 'asc');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: {
        revalidate: POSTS_REVALIDATE_SECONDS,
        tags: [EVENT_CATEGORIES_CACHE_TAG],
      },
    });

    if (!response.ok) {
      return {
        message: 'No categories',
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }
    return response.json();
  } catch {
    return {
      message: 'Error',
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
}

interface EventsPageServerProps {
  searchParams: {
    page?: string;
    limit?: string;
    categoryId?: string;
    search?: string;
  };
}

export default async function EventsPageServer({
  searchParams,
}: EventsPageServerProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '5');
  const categoryId = searchParams.categoryId;
  const search = searchParams.search;

  let eventsResponse: IEventsPaginatedResponse = {
    message: 'Error',
    data: [],
    meta: { total: 0, page: 1, limit, totalPages: 1 },
  };
  let featuredEvent: IEvent | null = null;
  let categories: ICategoriesPaginatedResponse['data'] = [];

  try {
    const [events, featured, categoriesResp] = await Promise.all([
      fetchEvents({ page, limit, categoryId, search }),
      fetchLatestFeaturedEvent(),
      fetchCategories(),
    ]);

    eventsResponse = events;
    featuredEvent = featured;
    categories = categoriesResp.data;
  } catch (error) {
    console.error('Error fetching events data:', error);
  }

  const featuredEventId = featuredEvent?.id;

  const recentEvents = eventsResponse.data
    .slice(0, 5)
    .filter((event) => event.id !== featuredEventId);

  const events = eventsResponse.data.filter(
    (event) => event.id !== featuredEventId,
  );

  return (
    <EventsPageClient
      events={events}
      featuredEvent={featuredEvent}
      recentEvents={recentEvents}
      categories={categories}
      totalPages={eventsResponse.meta.totalPages ?? 1}
      currentPage={page}
      totalCount={eventsResponse.meta.total ?? 0}
      selectedEventCategory={categoryId}
      searchQuery={search}
    />
  );
}
