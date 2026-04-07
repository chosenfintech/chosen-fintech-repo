// src/app/api/posts/categories/stats/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handleApiError } from '@/middlewares/error-handler';

/**
 * GET /api/categories/stats
 * Public — returns aggregate statistics across all categories.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const stats = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { posts: true } },
      },
      orderBy: { posts: { _count: 'desc' } },
    });

    const totalCategories = stats.length;
    const totalPosts = stats.reduce((sum, c) => sum + c._count.posts, 0);
    const avgPostsPerCategory =
      totalCategories > 0 ? totalPosts / totalCategories : 0;

    return NextResponse.json({
      message: 'Category statistics retrieved successfully',
      data: {
        totalCategories,
        totalPosts,
        avgPostsPerCategory: Math.round(avgPostsPerCategory * 100) / 100,
        categories: stats.map((c) => ({
          id: c.id,
          name: c.name,
          totalPostsCount: c._count.posts,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })),
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
