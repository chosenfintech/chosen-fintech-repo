// src/app/api/posts/blog-and-education/route.ts
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

/**
 * GET /api/posts/blog-and-education
 * Public — returns only published posts in the blog or education category.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IPostsQueryParams = {
      categoryId: searchParams.get('categoryId') ?? undefined,
      authorId: searchParams.get('authorId') ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildPostWhereClause(queryParams, {
      forcePublished: true,
      postType: 'blog-and-education',
    });

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
