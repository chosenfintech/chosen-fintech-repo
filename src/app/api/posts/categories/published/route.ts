// src/app/api/posts/categories/published/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/middlewares/error-handler';
import { getCategories } from '@/utils/get-categories';
import type { ICategoriesPaginatedResponse } from '@/types/posts/category.types';

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
    const postType = searchParams.get('postType') ?? undefined;

    const { categories, total } = await getCategories({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      postType,
      isPublic: true,
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
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
