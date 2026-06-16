// src/utils/revalidate-gallery.ts
import { revalidateTag } from 'next/cache';
import { GALLERY_CACHE_TAG } from '@/config/cache';

/**
 * Invalidates the ISR cache for the public gallery (categories grid + photos)
 * so an admin change to gallery photos/categories goes live immediately.
 */
export function revalidatePublishedGallery(): void {
  revalidateTag(GALLERY_CACHE_TAG, 'max');
}
