// src/app/api/gallery/published/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/middlewares/error-handler';
import { getGalleryCategories } from '@/utils/get-gallery-categories';
import type { IGalleryCategoriesPaginatedResponse } from '@/types/gallery/gallery-category.types';

/**
 * GET /api/gallery/published/categories
 *
 * Public — returns all gallery categories with pagination, search, and sort.
 * No authentication required. Responses are cached at the edge.
 *
 * Each category includes published, unpublished, and total photo counts.
 * The `hasPhotos` filter restricts results to categories with at least one
 * published photo when set to `'true'`.
 *
 * @cacheControl public, s-maxage=300, stale-while-revalidate=600
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const search = searchParams.get('search') ?? undefined;
    const sortBy = searchParams.get('sortBy') ?? 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as
      | 'asc'
      | 'desc';
    const hasPhotos = searchParams.get('hasPhotos') === 'true';

    const { categories, total } = await getGalleryCategories({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      hasPhotos,
      isPublic: true,
    });

    const paginatedResponse: IGalleryCategoriesPaginatedResponse = {
      message: 'Gallery categories retrieved successfully',
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(paginatedResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
