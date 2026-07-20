// src/app/api/team/published/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  buildTeamMemberWhereClause,
  fetchTeamMembersWithPagination,
  mapTeamMembersToResponse,
} from '@/utils/team-member-utils';
import { handleApiError } from '@/middlewares/error-handler';
import type {
  ITeamMembersPaginatedResponse,
  ITeamMembersQueryParams,
} from '@/types/team/team-member.types';

/**
 * GET /api/team/published
 * Public - published team members only, in the admin-chosen display order.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '50');

    const queryParams: ITeamMembersQueryParams = {
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildTeamMemberWhereClause(queryParams, {
      forcePublished: true,
    });

    const { members, total } = await fetchTeamMembersWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: ITeamMembersPaginatedResponse = {
      message: 'Published team members retrieved successfully',
      data: mapTeamMembersToResponse(members),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(paginatedResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
