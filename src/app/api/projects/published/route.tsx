// src/app/api/projects/published/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import {
  buildProjectWhereClause,
  fetchProjectsWithPagination,
  mapProjectsToResponse,
} from '@/utils/project-utils';
import type {
  IProjectsPaginatedResponse,
  IProjectsQueryParams,
} from '@/types/projects/project.types';
import { handleApiError } from '@/middlewares/error-handler';
import { parseBoolean } from '@/utils/parse-booleans';

/**
 * GET /api/projects/published
 * Public — returns only published projects.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IProjectsQueryParams = {
      authorId: searchParams.get('authorId') ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildProjectWhereClause(queryParams, {
      forcePublished: true,
    });

    const { projects, total } = await fetchProjectsWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IProjectsPaginatedResponse = {
      message: 'Projects retrieved successfully',
      data: mapProjectsToResponse(projects),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(paginatedResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
