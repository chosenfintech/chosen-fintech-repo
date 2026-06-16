// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import type { IGuide, IGuidesPaginatedResponse } from '@/types/guides/guide.types';
import type {
  IProject,
  IProjectsPaginatedResponse,
} from '@/types/projects/project.types';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';
import { IEvent, IEventsPaginatedResponse } from '@/types/events/event.types';
import {
  POSTS_CACHE_TAG,
  EVENTS_CACHE_TAG,
  GUIDES_CACHE_TAG,
  PROJECTS_CACHE_TAG,
  POSTS_REVALIDATE_SECONDS,
} from '@/config/cache';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

async function fetchAllEvents(): Promise<IEvent[]> {
  try {
    const url = new URL(`/api/events/published`, baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '1000');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [EVENTS_CACHE_TAG] },
    });

    if (!response.ok) {
      console.error('Failed to fetch events for sitemap');
      return [];
    }

    const result: IEventsPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('Error fetching events for sitemap:', error);
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
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [POSTS_CACHE_TAG] },
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

async function fetchAllProjects(): Promise<IProject[]> {
  try {
    const url = new URL(`/api/projects/published`, baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '1000');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [PROJECTS_CACHE_TAG] },
    });

    if (!response.ok) {
      console.error('Failed to fetch projects for sitemap');
      return [];
    }

    const result: IProjectsPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
    return [];
  }
}

async function fetchAllGuides(): Promise<IGuide[]> {
  try {
    const url = new URL(`/api/guides/published`, baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '1000');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [GUIDES_CACHE_TAG] },
    });

    if (!response.ok) {
      console.error('Failed to fetch guides for sitemap');
      return [];
    }

    const result: IGuidesPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('Error fetching guides for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, academyPosts, guides, projects] = await Promise.all([
    fetchAllEvents(),
    fetchAllAcademyPosts(),
    fetchAllGuides(),
    fetchAllProjects(),
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
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ];

  // ── Dynamic event pages ───────────────────────────────────────────────────────
  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updatedAt
      ? new Date(event.updatedAt)
      : new Date(event.createdAt || Date.now()),
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
    lastModified: project.updatedAt
      ? new Date(project.updatedAt)
      : new Date(project.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Dynamic academy guide pages ───────────────────────────────────────────────
  const academyGuidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/academy/${guide.slug}`,
    lastModified: guide.updatedAt
      ? new Date(guide.updatedAt)
      : new Date(guide.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...eventPages,
    ...academyPostPages,
    ...projectPages,
    ...academyGuidePages,
  ];
}
