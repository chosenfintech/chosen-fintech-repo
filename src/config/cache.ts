// src/config/cache.ts
//
// Cache tags and revalidation windows for ISR on public pages. Published posts
// (events + blog/academy) are cached for an hour so list and detail pages are
// served statically, and invalidated on-demand via revalidateTag whenever an
// admin mutates a post or category — so edits go live immediately instead of
// waiting out the time window.

/** Tags every public fetch of published posts (lists, featured, detail, sitemap). */
export const POSTS_CACHE_TAG = 'published-posts';

/** Tags every public fetch of published post categories (filter lists). */
export const POST_CATEGORIES_CACHE_TAG = 'published-post-categories';

/** Tags every public fetch of published events (lists, featured, detail, sitemap). */
export const EVENTS_CACHE_TAG = 'published-events';

/** Tags every public fetch of published event categories (filter lists). */
export const EVENT_CATEGORIES_CACHE_TAG = 'published-event-categories';

/** Tags every public fetch of published academy guides. */
export const GUIDES_CACHE_TAG = 'published-guides';

/** Tags every public fetch of published projects. */
export const PROJECTS_CACHE_TAG = 'published-projects';

/** Default ISR window for public content — 1 hour. */
export const POSTS_REVALIDATE_SECONDS = 3600;
