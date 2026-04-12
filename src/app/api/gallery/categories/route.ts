// src/app/api/gallery/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { Prisma } from '@/lib/prisma';
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

/**
 * GET /api/gallery/categories
 * Public — returns all gallery categories with pagination, search, and sort.
 * Each category includes published, unpublished, and total photo counts.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') ?? undefined;
    const sortBy = searchParams.get('sortBy') ?? 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as
      | 'asc'
      | 'desc';

    const whereClause: Prisma.GalleryCategoryWhereInput = {};

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const orderBy: Prisma.GalleryCategoryOrderByWithRelationInput = {};
    if (sortBy === 'photoCount' || sortBy === 'publishedPhotoCount') {
      orderBy.photos = { _count: sortOrder };
    } else if (
      sortBy === 'name' ||
      sortBy === 'createdAt' ||
      sortBy === 'updatedAt'
    ) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [categories, total] = await Promise.all([
      prisma.galleryCategory.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: {
              photos: { where: { isPublished: true } },
            },
          },
        },
      }),
      prisma.galleryCategory.count({ where: whereClause }),
    ]);

    // Single groupBy to get unpublished counts — avoids N+1 queries
    const unpublishedGroups = await prisma.galleryPhoto.groupBy({
      by: ['categoryId'],
      where: {
        categoryId: { in: categories.map((c) => c.id) },
        isPublished: false,
      },
      _count: { id: true },
    });

    const unpublishedCountMap = new Map(
      unpublishedGroups.map((g) => [g.categoryId, g._count.id]),
    );

    const response: IGalleryCategory[] = categories.map((category) => {
      const unpublished = unpublishedCountMap.get(category.id) ?? 0;
      return {
        id: category.id,
        name: category.name,
        isFeatured: category.isFeatured,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        publishedPhotosCount: category._count.photos,
        unpublishedPhotosCount: unpublished,
        totalPhotosCount: category._count.photos + unpublished,
      };
    });

    // totalPhotoCount sort is derived, so done in-memory
    if (sortBy === 'totalPhotoCount') {
      response.sort((a, b) => {
        const diff = a.totalPhotosCount - b.totalPhotosCount;
        return sortOrder === 'asc' ? diff : -diff;
      });
    }

    const paginatedResponse: IGalleryCategoriesPaginatedResponse = {
      message: 'Gallery categories retrieved successfully',
      data: response,
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
