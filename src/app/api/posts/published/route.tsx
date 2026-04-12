// src/app/api/posts/published/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import {
  buildPostWhereClause,
  fetchPostsWithPagination,
  mapPostsToResponse,
} from '@/utils/post-utils';
import type {
  IPostsPaginatedResponse,
  IPostsQueryParams,
} from '@/types/posts/post.types';
import { handleApiError } from '@/middlewares/error-handler';
import { parseBoolean } from '@/utils/parse-booleans';
import type { GetPostsOptions } from '@/utils/post-utils';

/**
 * GET /api/posts/public
 * Public — returns only published posts.
 *
 * Optional postType param narrows the category scope:
 *   ?postType=events             → excludes blog and education categories
 *   ?postType=blog-and-education → only blog and education categories
 *   omitted                      → all published posts
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const rawPostType = searchParams.get('postType') ?? undefined;
    const postType =
      rawPostType === 'events' || rawPostType === 'blog-and-education'
        ? rawPostType
        : undefined;

    const queryParams: IPostsQueryParams = {
      categoryId: searchParams.get('categoryId') ?? undefined,
      authorId: searchParams.get('authorId') ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const options: GetPostsOptions = {
      forcePublished: true,
      ...(postType && { postType }),
    };

    const whereClause = buildPostWhereClause(queryParams, options);

    const { posts, total } = await fetchPostsWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IPostsPaginatedResponse = {
      message: 'Posts retrieved successfully',
      data: mapPostsToResponse(posts),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(paginatedResponse);
  } catch (err) {
    return handleApiError(err);
  }
}
