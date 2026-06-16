// src/app/api/guides/published/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import {
  buildGuideWhereClause,
  fetchGuidesWithPagination,
  mapGuidesToResponse,
} from '@/utils/guide-utils';
import type {
  IGuidesPaginatedResponse,
  IGuidesQueryParams,
  GuideLevel,
} from '@/types/guides/guide.types';
import { handleApiError } from '@/middlewares/error-handler';
import { withPublicAuthor } from '@/utils/public-author';
import { parseBoolean } from '@/utils/parse-booleans';

/**
 * GET /api/guides/published
 * Public — returns only published guides.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IGuidesQueryParams = {
      level: (searchParams.get('level') as GuideLevel) ?? undefined,
      authorId: searchParams.get('authorId') ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildGuideWhereClause(queryParams, {
      forcePublished: true,
    });

    const { guides, total } = await fetchGuidesWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IGuidesPaginatedResponse = {
      message: 'Guides retrieved successfully',
      data: mapGuidesToResponse(guides).map(withPublicAuthor),
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
