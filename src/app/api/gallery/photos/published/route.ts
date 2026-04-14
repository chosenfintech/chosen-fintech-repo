// src/app/api/gallery/photos/published/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  buildGalleryPhotoWhereClause,
  fetchGalleryPhotosWithPagination,
  mapGalleryPhotosToResponse,
} from '@/utils/gallery-photo-utils';
import { handleApiError } from '@/middlewares/error-handler';
import type {
  IGalleryPhotosPaginatedResponse,
  IGalleryPhotosQueryParams,
} from '@/types/gallery/gallery-photo.types';

/**
 * GET /api/gallery/photos/published
 * Public — returns only published gallery photos with pagination and filters.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IGalleryPhotosQueryParams = {
      categoryId: searchParams.get('categoryId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildGalleryPhotoWhereClause(queryParams, {
      forcePublished: true,
    });

    const { photos, total } = await fetchGalleryPhotosWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IGalleryPhotosPaginatedResponse = {
      message: 'Published gallery photos retrieved successfully',
      data: mapGalleryPhotosToResponse(photos),
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
