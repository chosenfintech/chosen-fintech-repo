// src/components/posts/BlogPageServer.tsx
import BlogPageClient from './BlogPageClient';
import { IPost } from '@/types/posts/post.types';
import { ICategoriesPaginatedResponse } from '@/types/posts/category.types';

/**
 * Fetch paginated published posts
 */
async function fetchPosts(params: {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
}) {
  const url = new URL(`/api/v1/posts/published`);
  url.searchParams.set('page', params.page.toString());
  url.searchParams.set('limit', params.limit.toString());

  if (params.categoryId) url.searchParams.set('categoryId', params.categoryId);
  if (params.search) url.searchParams.set('search', params.search);

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch posts');
    return {
      data: [],
      meta: { total: 0, page: 1, limit: params.limit, totalPages: 1 },
    };
  }

  return response.json();
}

/**
 * Fetch latest featured + published post (always 1)
 */
async function fetchLatestFeaturedPost(): Promise<IPost | null> {
  const url = new URL(`/api/v1/posts/published`);
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', '1');
  url.searchParams.set('isFeatured', 'true');

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch featured post');
    return null;
  }

  const result = await response.json();
  return result?.data?.[0] || null;
}

async function fetchCategories(): Promise<ICategoriesPaginatedResponse> {
  try {
    const url = new URL(`/api/v1/posts/categories`);
    url.searchParams.set('limit', '1000');
    url.searchParams.set('sortBy', 'name');
    url.searchParams.set('sortOrder', 'asc');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        message: 'No categories',
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
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
  const limit = parseInt(searchParams.limit || '6');
  const categoryId = searchParams.categoryId;
  const search = searchParams.search;

  try {
    const [postsResponse, featuredPost, categoriesResponse] = await Promise.all(
      [
        fetchPosts({ page, limit, categoryId, search }),
        fetchLatestFeaturedPost(),
        fetchCategories(),
      ],
    );

    const latestFeaturedPostId = featuredPost?.id;

    const filteredPosts: IPost[] = latestFeaturedPostId
      ? postsResponse.data.filter(
          (post: IPost) => post.id !== latestFeaturedPostId,
        )
      : postsResponse.data;

    return (
      <BlogPageClient
        posts={filteredPosts}
        featuredPost={featuredPost}
        categories={categoriesResponse.data || []}
        totalPages={postsResponse.meta.totalPages || 1}
        currentPage={page}
        pageSize={limit}
        totalCount={postsResponse.meta.total || 0}
        selectedCategory={categoryId}
        searchQuery={search}
      />
    );
  } catch (error) {
    console.error('Error fetching blog data:', error);

    return (
      <BlogPageClient
        posts={[]}
        featuredPost={null}
        categories={[]}
        totalPages={1}
        currentPage={1}
        pageSize={limit}
        totalCount={0}
        selectedCategory={categoryId}
        searchQuery={search}
      />
    );
  }
}
