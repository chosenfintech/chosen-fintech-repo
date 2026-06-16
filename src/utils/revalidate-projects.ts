// src/utils/revalidate-projects.ts
import { revalidateTag } from 'next/cache';
import { PROJECTS_CACHE_TAG } from '@/config/cache';

/**
 * Invalidates the ISR cache for public published-project pages (the projects
 * list, project detail, home latest-projects, and sitemap) so an admin change
 * goes live immediately.
 */
export function revalidatePublishedProjects(): void {
  // 'max' = purge immediately. Required second arg in Next 16 route handlers.
  revalidateTag(PROJECTS_CACHE_TAG, 'max');
}
