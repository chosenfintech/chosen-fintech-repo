// src/app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { handleApiError } from '@/middlewares/error-handler';

type Period = 'this_month' | 'last_month' | 'all_time';

function getDateRange(period: Period): { gte: Date; lte: Date } | undefined {
  if (period === 'all_time') return undefined;

  const now = new Date();

  if (period === 'this_month') {
    return {
      gte: new Date(now.getFullYear(), now.getMonth(), 1),
      lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
    };
  }

  if (period === 'last_month') {
    return {
      gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      lte: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
    };
  }
}

/**
 * GET /api/dashboard/stats
 * Protected — returns aggregated counts for posts, gallery, categories, and users.
 * Query params:
 *   period: 'this_month' | 'last_month' | 'all_time' (default: 'all_time')
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const { searchParams } = req.nextUrl;
    const rawPeriod = searchParams.get('period') ?? 'all_time';

    const validPeriods: Period[] = ['this_month', 'last_month', 'all_time'];
    const period: Period = validPeriods.includes(rawPeriod as Period)
      ? (rawPeriod as Period)
      : 'all_time';

    const dateRange = getDateRange(period);
    const createdAtFilter = dateRange ? { createdAt: dateRange } : {};

    const [
      totalPosts,
      publishedPosts,
      unpublishedPosts,
      featuredPosts,
      totalPhotos,
      publishedPhotos,
      unpublishedPhotos,
      totalPostCategories,
      totalGalleryCategories,
      totalUsers,
      totalAdmins,
    ] = await prisma.$transaction([
      prisma.post.count({ where: { ...createdAtFilter } }),
      prisma.post.count({ where: { ...createdAtFilter, isPublished: true } }),
      prisma.post.count({ where: { ...createdAtFilter, isPublished: false } }),
      prisma.post.count({ where: { ...createdAtFilter, isFeatured: true } }),

      prisma.galleryPhoto.count({ where: { ...createdAtFilter } }),
      prisma.galleryPhoto.count({
        where: { ...createdAtFilter, isPublished: true },
      }),
      prisma.galleryPhoto.count({
        where: { ...createdAtFilter, isPublished: false },
      }),

      prisma.category.count({ where: { ...createdAtFilter } }),
      prisma.galleryCategory.count({ where: { ...createdAtFilter } }),

      prisma.user.count({ where: { ...createdAtFilter } }),
      prisma.user.count({ where: { ...createdAtFilter, isAdmin: true } }),
    ]);

    return NextResponse.json({
      message: 'Dashboard stats fetched successfully',
      data: {
        period,
        posts: {
          total: totalPosts,
          published: publishedPosts,
          unpublished: unpublishedPosts,
          featured: featuredPosts,
        },
        gallery: {
          total: totalPhotos,
          published: publishedPhotos,
          unpublished: unpublishedPhotos,
        },
        categories: {
          posts: totalPostCategories,
          gallery: totalGalleryCategories,
        },
        users: {
          total: totalUsers,
          admins: totalAdmins,
          regular: totalUsers - totalAdmins,
        },
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
