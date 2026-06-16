// src/app/api/events/published/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import {
  buildEventWhereClause,
  fetchEventsWithPagination,
  mapEventsToResponse,
} from '@/utils/event-utils';
import type {
  IEventsPaginatedResponse,
  IEventsQueryParams,
} from '@/types/events/event.types';
import { handleApiError } from '@/middlewares/error-handler';
import { parseBoolean } from '@/utils/parse-booleans';

/**
 * GET /api/events/published
 * Public — returns only published events.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IEventsQueryParams = {
      categoryId: searchParams.get('categoryId') ?? undefined,
      authorId: searchParams.get('authorId') ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildEventWhereClause(queryParams, {
      forcePublished: true,
    });

    const { events, total } = await fetchEventsWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IEventsPaginatedResponse = {
      message: 'Events retrieved successfully',
      data: mapEventsToResponse(events),
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
