// src/components/academy/AcademyPageServer.tsx
import AcademyPageClient from './AcademyPageClient';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';
import { ICategoriesPaginatedResponse } from '@/types/posts/category.types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const ACADEMY_CATEGORY_NAMES = ['blog', 'education'];

async function fetchCategories(): Promise<ICategoriesPaginatedResponse> {
  try {
    const url = new URL(`/api/posts/categories`, baseUrl);
    url.searchParams.set('limit', '1000');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        message: 'No categories',
        data: [],
        meta: { total: 0, page: 1, limit: 1000, totalPages: 0 },
      };
    }
    return response.json();
  } catch {
    return {
      message: 'Error',
      data: [],
      meta: { total: 0, page: 1, limit: 1000, totalPages: 0 },
    };
  }
}

async function fetchPostsByCategory(params: {
  categoryId: string;
  page: number;
  limit: number;
  search?: string;
}): Promise<IPostsPaginatedResponse> {
  const url = new URL(`/api/posts`, baseUrl);
  url.searchParams.set('page', params.page.toString());
  url.searchParams.set('limit', params.limit.toString());
  url.searchParams.set('categoryId', params.categoryId);
  if (params.search) url.searchParams.set('search', params.search);

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    return {
      message: 'Error',
      data: [],
      meta: { total: 0, page: 1, limit: params.limit, totalPages: 1 },
    };
  }
  return response.json();
}

function mergeAndDeduplicatePosts(
  responses: IPostsPaginatedResponse[],
): { posts: IPost[]; total: number } {
  const seen = new Set<string>();
  const posts: IPost[] = [];

  for (const res of responses) {
    for (const post of res.data) {
      if (!seen.has(post.id)) {
        seen.add(post.id);
        posts.push(post);
      }
    }
  }

  const total = responses.reduce((sum, res) => sum + (res.meta.total ?? 0), 0);
  return { posts, total };
}

interface AcademyPageServerProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

export default async function AcademyPageServer({
  searchParams,
}: AcademyPageServerProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '5');
  const search = searchParams.search;

  let posts: IPost[] = [];
  let recentPosts: IPost[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    // Step 1: fetch all categories and find Blog + Education IDs
    const categoriesResp = await fetchCategories();
    const academyCategoryIds = categoriesResp.data
      .filter((cat) =>
        ACADEMY_CATEGORY_NAMES.includes(cat.name.toLowerCase()),
      )
      .map((cat) => cat.id);

    if (academyCategoryIds.length > 0) {
      // Step 2: fetch posts for each category ID in parallel
      const [postResponses, recentResponses] = await Promise.all([
        Promise.all(
          academyCategoryIds.map((categoryId) =>
            fetchPostsByCategory({ categoryId, page, limit, search }),
          ),
        ),
        Promise.all(
          academyCategoryIds.map((categoryId) =>
            fetchPostsByCategory({ categoryId, page: 1, limit: 3 }),
          ),
        ),
      ]);

      const merged = mergeAndDeduplicatePosts(postResponses);
      const mergedRecent = mergeAndDeduplicatePosts(recentResponses);

      posts = merged.posts;
      total = merged.total;
      // Derive totalPages from the combined total
      totalPages = Math.ceil(total / limit) || 1;
      recentPosts = mergedRecent.posts.slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching academy data:', error);
  }

  return (
    <AcademyPageClient
      posts={posts}
      recentPosts={recentPosts}
      totalPages={totalPages}
      currentPage={page}
      pageSize={limit}
      totalCount={total}
      searchQuery={search}
    />
  );
}