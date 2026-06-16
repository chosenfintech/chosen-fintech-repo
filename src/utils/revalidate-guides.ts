// src/utils/revalidate-guides.ts
import { revalidateTag } from 'next/cache';
import { GUIDES_CACHE_TAG } from '@/config/cache';

/**
 * Invalidates the ISR cache for public published-guide pages (the academy
 * guides grid, guide detail, and sitemap) so an admin change goes live
 * immediately.
 */
export function revalidatePublishedGuides(): void {
  // 'max' = purge immediately. Required second arg in Next 16 route handlers.
  revalidateTag(GUIDES_CACHE_TAG, 'max');
}
