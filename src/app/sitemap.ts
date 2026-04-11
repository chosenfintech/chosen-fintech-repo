// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { projects } from '@/static-data/projects';
import { academyGuides } from '@/static-data/academy-guides';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';
import { ICategoriesPaginatedResponse } from '@/types/posts/category.types';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

// ─── Fetch all event posts (for /events/[slug]) ───────────────────────────────
async function fetchAllEventPosts(): Promise<IPost[]> {
  try {
    const url = new URL(`/api/posts`, baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '1000');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
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

// ─── Fetch all categories ─────────────────────────────────────────────────────
async function fetchAllCategories(): Promise<
  ICategoriesPaginatedResponse['data']
> {
  try {
    const url = new URL(`/api/posts/categories`, baseUrl);
    url.searchParams.set('limit', '1000');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch categories for sitemap');
      return [];
    }

    const result: ICategoriesPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

// ─── Fetch posts by category ID ───────────────────────────────────────────────
async function fetchPostsByCategoryId(categoryId: string): Promise<IPost[]> {
  try {
    const url = new URL(`/api/posts`, baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '1000');
    url.searchParams.set('categoryId', categoryId);

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch posts for category ${categoryId}`);
      return [];
    }

    const result: IPostsPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error);
    return [];
  }
}

// ─── Fetch all academy posts (blog + education) with deduplication ────────────
async function fetchAllAcademyPosts(): Promise<{
  blog: IPost[];
  education: IPost[];
}> {
  try {
    const allCategories = await fetchAllCategories();

    const blogCategory = allCategories.find(
      (cat) => cat.name.toLowerCase() === 'blog',
    );
    const educationCategory = allCategories.find(
      (cat) => cat.name.toLowerCase() === 'education',
    );

    const [blogPosts, educationPosts] = await Promise.all([
      blogCategory
        ? fetchPostsByCategoryId(blogCategory.id)
        : Promise.resolve([]),
      educationCategory
        ? fetchPostsByCategoryId(educationCategory.id)
        : Promise.resolve([]),
    ]);

    return { blog: blogPosts, education: educationPosts };
  } catch (error) {
    console.error('Error fetching academy posts for sitemap:', error);
    return { blog: [], education: [] };
  }
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [eventPosts, { blog: blogPosts, education: educationPosts }] =
    await Promise.all([fetchAllEventPosts(), fetchAllAcademyPosts()]);

  // ── Static pages ────────────────────────────────────────────────────────────
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

  // ── Dynamic event pages (API) ────────────────────────────────────────────────
  const eventPages: MetadataRoute.Sitemap = eventPosts.map((post) => ({
    url: `${baseUrl}/events/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : new Date(post.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // ── Dynamic project pages (static data) ─────────────────────────────────────
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Dynamic academy guide pages (static data) ────────────────────────────────
  const academyGuidePages: MetadataRoute.Sitemap = academyGuides.map(
    (guide) => ({
      url: `${baseUrl}/academy/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }),
  );

  // ── Dynamic academy blog post pages (API) ────────────────────────────────────
  const academyBlogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/academy/blog/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : new Date(post.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Dynamic academy education post pages (API) ───────────────────────────────
  const academyEducationPages: MetadataRoute.Sitemap = educationPosts.map(
    (post) => ({
      url: `${baseUrl}/academy/education/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : new Date(post.createdAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }),
  );

  return [
    ...staticPages,
    ...eventPages,
    ...projectPages,
    ...academyGuidePages,
    ...academyBlogPages,
    ...academyEducationPages,
  ];
}
