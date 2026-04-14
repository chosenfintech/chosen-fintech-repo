// src/app/api/posts/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  ConflictError,
} from '@/middlewares/error-handler';
import type {
  ICategory,
  ICategoriesPaginatedResponse,
} from '@/types/posts/category.types';
import { createCategorySchema } from '@/validations/posts/category-validation';
import { getCategories } from '@/utils/get-categories';

/**
 * GET /api/categories
 * Protected — returns all categories with pagination, search, and sort.
 * Accepts optional postType param:
 *   - 'events'              → excludes blog and education categories
 *   - 'blog-and-education'  → returns only blog and education categories
 *   - omitted               → returns all categories
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
    const postType = searchParams.get('postType') ?? undefined;

    const { categories, total } = await getCategories({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      postType,
      isPublic: false,
    });

    const paginatedResponse: ICategoriesPaginatedResponse = {
      message: 'Categories retrieved successfully',
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
