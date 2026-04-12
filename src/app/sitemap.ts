// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { projects } from '@/static-data/projects';
import { academyGuides } from '@/static-data/academy-guides';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

async function fetchAllEventPosts(): Promise<IPost[]> {
  try {
    const url = new URL(`/api/posts/published`, baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '1000');
    url.searchParams.set('postType', 'events');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('Failed to fetch event posts for sitemap');
      return [];
    }

    const result: IPostsPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('Error fetching event posts for sitemap:', error);
    return [];
  }
}

async function fetchAllAcademyPosts(): Promise<IPost[]> {
  try {
    const url = new URL(`/api/posts/published`, baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '1000');
    url.searchParams.set('postType', 'blog-and-education');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('Failed to fetch academy posts for sitemap');
      return [];
    }

    const result: IPostsPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('Error fetching academy posts for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [eventPosts, academyPosts] = await Promise.all([
    fetchAllEventPosts(),
    fetchAllAcademyPosts(),
  ]);

  // ── Static pages ─────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/academy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // ── Dynamic event post pages ──────────────────────────────────────────────────
  const eventPages: MetadataRoute.Sitemap = eventPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : new Date(post.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // ── Dynamic academy post pages ────────────────────────────────────────────────
  const academyPostPages: MetadataRoute.Sitemap = academyPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : new Date(post.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Dynamic project pages ─────────────────────────────────────────────────────
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Dynamic academy guide pages (static data) ─────────────────────────────────
  const academyGuidePages: MetadataRoute.Sitemap = academyGuides.map(
    (guide) => ({
      url: `${baseUrl}/academy/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }),
  );

  return [
    ...staticPages,
    ...eventPages,
    ...academyPostPages,
    ...projectPages,
    ...academyGuidePages,
  ];
}
