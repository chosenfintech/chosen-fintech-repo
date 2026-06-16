// src/utils/revalidate-events.ts
import { revalidateTag } from 'next/cache';
import { EVENTS_CACHE_TAG, EVENT_CATEGORIES_CACHE_TAG } from '@/config/cache';

/**
 * Invalidates the ISR cache for public published-event pages (the events list,
 * event detail, home latest-events, and sitemap) so an admin change goes live
 * immediately. Pass `categories: true` when the change can affect which
 * categories have published events (create, delete, publish toggle).
 */
export function revalidatePublishedEvents(
  opts: { categories?: boolean } = {},
): void {
  // 'max' = purge immediately. Required second arg in Next 16 route handlers
  // (single-arg revalidateTag is deprecated; updateTag is Server-Action only).
  revalidateTag(EVENTS_CACHE_TAG, 'max');
  if (opts.categories) revalidateTag(EVENT_CATEGORIES_CACHE_TAG, 'max');
}

/** Invalidates the cached published event-category filter lists. */
export function revalidateEventCategories(): void {
  revalidateTag(EVENT_CATEGORIES_CACHE_TAG, 'max');
}
