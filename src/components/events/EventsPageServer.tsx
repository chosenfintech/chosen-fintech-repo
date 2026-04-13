// src/components/events/BlogPageServer.tsx
import BlogPageClient from './EventsPageClient';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';
import { ICategoriesPaginatedResponse } from '@/types/posts/category.types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function fetchEventsPosts(params: {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
}): Promise<IPostsPaginatedResponse> {
  const url = new URL(`/api/posts/published`, baseUrl);
  url.searchParams.set('page', params.page.toString());
  url.searchParams.set('limit', params.limit.toString());
  url.searchParams.set('postType', 'events');
  if (params.categoryId) url.searchParams.set('categoryId', params.categoryId);
  if (params.search) url.searchParams.set('search', params.search);

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch events posts');
    return {
      message: 'Error',
      data: [],
      meta: { total: 0, page: 1, limit: params.limit, totalPages: 1 },
    };
  }

  return response.json();
}

async function fetchLatestFeaturedPost(): Promise<IPost | null> {
  const url = new URL(`/api/posts/published`, baseUrl);
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', '1');
  url.searchParams.set('isFeatured', 'true');
  url.searchParams.set('postType', 'events');

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch featured post');
    return null;
  }

  const result = await response.json();
  return result?.data?.[0] ?? null;
}

async function fetchCategories(): Promise<ICategoriesPaginatedResponse> {
  try {
    const url = new URL(`/api/posts/categories`, baseUrl);
    url.searchParams.set('limit', '1000');
    url.searchParams.set('sortBy', 'name');
    url.searchParams.set('sortOrder', 'asc');
    url.searchParams.set('postType', 'events');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
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

interface BlogPageServerProps {
  searchParams: {
    page?: string;
    limit?: string;
    categoryId?: string;
    search?: string;
  };
}

export default async function BlogPageServer({
  searchParams,
}: BlogPageServerProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '5');
  const categoryId = searchParams.categoryId;
  const search = searchParams.search;

  let postsResponse: IPostsPaginatedResponse = {
    message: 'Error',
    data: [],
    meta: { total: 0, page: 1, limit, totalPages: 1 },
  };
  let featuredPost: IPost | null = null;
  let categories: ICategoriesPaginatedResponse['data'] = [];

  try {
    const [posts, featured, categoriesResp] = await Promise.all([
      fetchEventsPosts({ page, limit, categoryId, search }),
      fetchLatestFeaturedPost(),
      fetchCategories(),
    ]);

    postsResponse = posts;
    featuredPost = featured;
    // The events route already excludes blog and education on the backend,
    // so all categories returned from it are safe to display as filters.
    categories = categoriesResp.data;
  } catch (error) {
    console.error('Error fetching blog data:', error);
  }

  const featuredPostId = featuredPost?.id;

  const recentPosts = postsResponse.data
    .slice(0, 5)
    .filter((post) => post.id !== featuredPostId);

  const posts = postsResponse.data.filter((post) => post.id !== featuredPostId);

  return (
    <BlogPageClient
      posts={posts}
      featuredPost={featuredPost}
      recentPosts={recentPosts}
      categories={categories}
      totalPages={postsResponse.meta.totalPages ?? 1}
      currentPage={page}
      totalCount={postsResponse.meta.total ?? 0}
      selectedCategory={categoryId}
      searchQuery={search}
    />
  );
}
