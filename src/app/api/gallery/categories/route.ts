// src/app/api/gallery/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  ConflictError,
} from '@/middlewares/error-handler';
import type {
  IGalleryCategory,
  IGalleryCategoriesPaginatedResponse,
} from '@/types/gallery/gallery-category.types';
import { createGalleryCategorySchema } from '@/validations/gallery/gallery-category-validation';
import { getGalleryCategories } from '@/utils/get-gallery-categories';

/**
 * GET /api/gallery/categories
 *
 * Protected — requires an active session. Returns all gallery categories
 * with pagination, search, and sort, including unpublished photo counts
 * visible only to authenticated users.
 *
 * @cacheControl no-store
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

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
      isPublic: false,
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
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

// ... your POST handler remains unchanged below
/**
 * POST /api/gallery/categories
 * Protected — creates a new gallery category.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const body = await req.json();

    const validation = createGalleryCategorySchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const { name, isFeatured } = validation.data;

    const existingCategory = await prisma.galleryCategory.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictError(
        `Gallery category with name "${name}" already exists`,
      );
    }

    const category = await prisma.galleryCategory.create({
      data: { name, isFeatured },
      include: {
        _count: { select: { photos: true } },
      },
    });

    const responseData: IGalleryCategory = {
      id: category.id,
      name: category.name,
      isFeatured: category.isFeatured,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      totalPhotosCount: category._count.photos,
    };

    return NextResponse.json(
      { message: 'Gallery category created successfully', data: responseData },
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
