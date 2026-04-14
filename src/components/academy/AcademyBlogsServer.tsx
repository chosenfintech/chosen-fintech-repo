// src/components/academy/AcademyBlogsServer.tsx
import AcademyBlogsClient from './AcademyBlogsClient';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';
import {
  ICategory,
  ICategoriesPaginatedResponse,
} from '@/types/posts/category.types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function fetchBlogAndEducationPosts(params: {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
}): Promise<IPostsPaginatedResponse> {
  const url = new URL(`/api/posts/published`, baseUrl);
  url.searchParams.set('page', params.page.toString());
  url.searchParams.set('limit', params.limit.toString());
  url.searchParams.set('postType', 'blog-and-education');
  if (params.search) url.searchParams.set('search', params.search);
  if (params.categoryId) url.searchParams.set('categoryId', params.categoryId);

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

async function fetchCategories(): Promise<ICategoriesPaginatedResponse> {
  try {
    const url = new URL(`/api/posts/categories/published`, baseUrl);
    url.searchParams.set('limit', '1000');
    url.searchParams.set('sortBy', 'name');
    url.searchParams.set('sortOrder', 'asc');
    url.searchParams.set('postType', 'blog-and-education');

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

interface AcademyBlogsServerProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
  };
}

export default async function AcademyBlogsServer({
  searchParams,
}: AcademyBlogsServerProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '5');
  const search = searchParams.search;
  const categoryId = searchParams.categoryId;

  let posts: IPost[] = [];
  let recentPosts: IPost[] = [];
  let categories: ICategory[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const [postsResp, recentResp, categoriesResp] = await Promise.all([
      fetchBlogAndEducationPosts({ page, limit, search, categoryId }),
      fetchBlogAndEducationPosts({ page: 1, limit: 3 }),
      fetchCategories(),
    ]);

    posts = postsResp.data;
    total = postsResp.meta.total ?? 0;
    totalPages = postsResp.meta.totalPages ?? 1;
    recentPosts = recentResp.data;
    categories = categoriesResp.data;
  } catch (error) {
    console.error('Error fetching academy blogs data:', error);
  }

  return (
    <AcademyBlogsClient
      posts={posts}
      recentPosts={recentPosts}
      categories={categories}
      totalPages={totalPages}
      currentPage={page}
      pageSize={limit}
      totalCount={total}
      searchQuery={search}
      selectedCategory={categoryId}
    />
  );
}
