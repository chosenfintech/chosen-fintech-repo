// src/components/academy/AcademyPageServer.tsx
import AcademyPageClient from './AcademyPageClient';
import { IPost, IPostsPaginatedResponse } from '@/types/posts/post.types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function fetchBlogAndEducationPosts(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<IPostsPaginatedResponse> {
  const url = new URL(`/api/posts/blog-and-education`, baseUrl);
  url.searchParams.set('page', params.page.toString());
  url.searchParams.set('limit', params.limit.toString());
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
    const [postsResp, recentResp] = await Promise.all([
      fetchBlogAndEducationPosts({ page, limit, search }),
      fetchBlogAndEducationPosts({ page: 1, limit: 3 }),
    ]);

    posts = postsResp.data;
    total = postsResp.meta.total ?? 0;
    totalPages = postsResp.meta.totalPages ?? 1;
    recentPosts = recentResp.data;
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
