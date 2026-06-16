// src/utils/revalidate-posts.ts
import { revalidateTag } from 'next/cache';
import { POSTS_CACHE_TAG, POST_CATEGORIES_CACHE_TAG } from '@/config/cache';

/**
 * Invalidates the ISR cache for public published-post pages (events + academy
 * lists, post detail, latest-events, sitemap) so an admin change goes live
 * immediately. Pass `categories: true` when the change can affect which
 * categories have published posts (create, delete, publish toggle).
 */
export function revalidatePublishedPosts(
  opts: { categories?: boolean } = {},
): void {
  // 'max' = purge immediately. Required second arg in Next 16 route handlers
  // (single-arg revalidateTag is deprecated; updateTag is Server-Action only).
  revalidateTag(POSTS_CACHE_TAG, 'max');
  if (opts.categories) revalidateTag(POST_CATEGORIES_CACHE_TAG, 'max');
}

/** Invalidates the cached published-category filter lists. */
export function revalidatePostCategories(): void {
  revalidateTag(POST_CATEGORIES_CACHE_TAG, 'max');
}
