// components/blog/BlogPageServer.tsx
import BlogPageClient from './BlogPageClient';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';
import { ICategoriesPaginatedResponse } from '@/types/posts/category.types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function fetchPosts(params: {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
}): Promise<IPostsPaginatedResponse> {
  const url = new URL(`/api/posts`, baseUrl);
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
      message: 'Error',
      data: [],
      meta: { total: 0, page: 1, limit: params.limit, totalPages: 1 },
    };
  }

  return response.json();
}

async function fetchRecentPosts(): Promise<IPost[]> {
  const url = new URL(`/api/posts`, baseUrl);
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', '3');

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) return [];
  const result: IPostsPaginatedResponse = await response.json();
  return result.data ?? [];
}

async function fetchCategories(): Promise<ICategoriesPaginatedResponse> {
  try {
    const url = new URL(`/api/posts/categories`, baseUrl);
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
  let recentPosts: IPost[] = [];
  let categories: ICategoriesPaginatedResponse['data'] = [];

  try {
    const [posts, recent, categoriesResp] = await Promise.all([
      fetchPosts({ page, limit, categoryId, search }),
      fetchRecentPosts(),
      fetchCategories(),
    ]);

    postsResponse = posts;
    recentPosts = recent;
    categories = categoriesResp.data ?? [];
  } catch (error) {
    console.error('Error fetching blog data:', error);
  }

  const hasActiveFilters = !!(categoryId || search);
  const featuredPost =
    !hasActiveFilters && page === 1 && postsResponse.data.length > 0
      ? postsResponse.data[0]
      : null;

  const posts = featuredPost ? postsResponse.data.slice(1) : postsResponse.data;

  return (
    <BlogPageClient
      posts={posts}
      featuredPost={featuredPost}
      recentPosts={recentPosts}
      categories={categories}
      totalPages={postsResponse.meta.totalPages ?? 1}
      currentPage={page}
      pageSize={limit}
      totalCount={postsResponse.meta.total ?? 0}
      selectedCategory={categoryId}
      searchQuery={search}
    />
  );
}
