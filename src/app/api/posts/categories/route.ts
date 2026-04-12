// src/app/api/posts/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  ConflictError,
} from '@/middlewares/error-handler';
import type { Prisma } from '@/lib/prisma';
import type {
  ICategory,
  ICategoriesPaginatedResponse,
} from '@/types/posts/category.types';
import { createCategorySchema } from '@/validations/posts/category-validation';
import { BLOG_AND_EDUCATION_CATEGORY_NAMES } from '@/utils/post-utils';

/**
 * GET /api/categories
 * Public — returns all categories with pagination, search, and sort.
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

    const whereClause: Prisma.CategoryWhereInput = {
      NOT: {
        name: {
          in: BLOG_AND_EDUCATION_CATEGORY_NAMES,
          mode: 'insensitive',
        },
      },
    };

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const orderBy: Prisma.CategoryOrderByWithRelationInput = {};
    if (sortBy === 'postCount' || sortBy === 'publishedPostCount') {
      orderBy.posts = { _count: sortOrder };
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
      prisma.category.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: {
              posts: { where: { isPublished: true } },
            },
          },
        },
      }),
      prisma.category.count({ where: whereClause }),
    ]);

    // Single groupBy instead of N+1 post.count queries
    const unpublishedGroups = await prisma.post.groupBy({
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

    const response: ICategory[] = categories.map((category) => {
      const unpublished = unpublishedCountMap.get(category.id) ?? 0;
      return {
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        publishedPostsCount: category._count.posts,
        unpublishedPostsCount: unpublished,
        totalPostsCount: category._count.posts + unpublished,
      };
    });

    // totalPostCount sort is done in-memory since it's a derived value
    if (sortBy === 'totalPostCount') {
      response.sort((a, b) => {
        const diff = a.totalPostsCount - b.totalPostsCount;
        return sortOrder === 'asc' ? diff : -diff;
      });
    }

    const paginatedResponse: ICategoriesPaginatedResponse = {
      message: 'Categories retrieved successfully',
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
 * POST /api/categories
 * Protected — creates a new category.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const body = await req.json();

    const validation = createCategorySchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const { name } = validation.data;

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictError(`Category with name "${name}" already exists`);
    }

    const category = await prisma.category.create({
      data: { name },
      include: {
        _count: { select: { posts: true } },
      },
    });

    const responseData: ICategory = {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      totalPostsCount: category._count.posts,
    };

    return NextResponse.json(
      { message: 'Category created successfully', data: responseData },
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
