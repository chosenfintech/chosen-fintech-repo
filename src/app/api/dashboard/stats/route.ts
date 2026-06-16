// src/app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { handleApiError } from '@/middlewares/error-handler';
import type {
  DashboardPeriod,
  IRecentContentItem,
} from '@/types/dashboard.types';

function getDateRange(
  period: DashboardPeriod,
): { gte: Date; lte: Date } | undefined {
  if (period === 'all_time') return undefined;

  const now = new Date();

  if (period === 'this_month') {
    return {
      gte: new Date(now.getFullYear(), now.getMonth(), 1),
      lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
    };
  }

  return {
    gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    lte: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
  };
}

/**
 * GET /api/dashboard/stats
 * Protected — aggregated counts for every content module (posts, events,
 * guides, projects, gallery), categories, users, plus recent activity.
 * Query: period = 'this_month' | 'last_month' | 'all_time' (default all_time)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const { searchParams } = req.nextUrl;
    const rawPeriod = searchParams.get('period') ?? 'all_time';
    const validPeriods: DashboardPeriod[] = [
      'this_month',
      'last_month',
      'all_time',
    ];
    const period: DashboardPeriod = validPeriods.includes(
      rawPeriod as DashboardPeriod,
    )
      ? (rawPeriod as DashboardPeriod)
      : 'all_time';

    const dateRange = getDateRange(period);
    const where = dateRange ? { createdAt: dateRange } : {};

    const [
      postsTotal,
      postsPublished,
      postsFeatured,
      eventsTotal,
      eventsPublished,
      eventsFeatured,
      guidesTotal,
      guidesPublished,
      guidesFeatured,
      projectsTotal,
      projectsPublished,
      projectsFeatured,
      photosTotal,
      photosPublished,
      postCategories,
      eventCategories,
      galleryCategories,
      usersTotal,
      admins,
    ] = await prisma.$transaction([
      prisma.post.count({ where }),
      prisma.post.count({ where: { ...where, isPublished: true } }),
      prisma.post.count({ where: { ...where, isFeatured: true } }),

      prisma.event.count({ where }),
      prisma.event.count({ where: { ...where, isPublished: true } }),
      prisma.event.count({ where: { ...where, isFeatured: true } }),

      prisma.guide.count({ where }),
      prisma.guide.count({ where: { ...where, isPublished: true } }),
      prisma.guide.count({ where: { ...where, isFeatured: true } }),

      prisma.project.count({ where }),
      prisma.project.count({ where: { ...where, isPublished: true } }),
      prisma.project.count({ where: { ...where, isFeatured: true } }),

      prisma.galleryPhoto.count({ where }),
      prisma.galleryPhoto.count({ where: { ...where, isPublished: true } }),

      prisma.category.count({ where }),
      prisma.eventCategory.count({ where }),
      prisma.galleryCategory.count({ where }),

      prisma.user.count({ where }),
      prisma.user.count({ where: { ...where, isAdmin: true } }),
    ]);

    const moduleStats = (
      total: number,
      published: number,
      featured: number,
    ) => ({
      total,
      published,
      unpublished: total - published,
      featured,
    });

    // Recent activity — latest items across content modules.
    const recentSelect = {
      id: true,
      title: true,
      slug: true,
      isPublished: true,
      createdAt: true,
    };
    const [recentPosts, recentEvents, recentGuides, recentProjects] =
      await Promise.all([
        prisma.post.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: recentSelect,
        }),
        prisma.event.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: recentSelect,
        }),
        prisma.guide.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: recentSelect,
        }),
        prisma.project.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: recentSelect,
        }),
      ]);

    const recent: IRecentContentItem[] = [
      ...recentPosts.map((p) => ({
        ...p,
        type: 'post' as const,
        href: `/dashboard/posts/${p.slug}/preview`,
      })),
      ...recentEvents.map((e) => ({
        ...e,
        type: 'event' as const,
        href: `/dashboard/events/${e.slug}/preview`,
      })),
      ...recentGuides.map((g) => ({
        ...g,
        type: 'guide' as const,
        href: `/dashboard/academy/${g.slug}/preview`,
      })),
      ...recentProjects.map((pr) => ({
        ...pr,
        type: 'project' as const,
        href: `/dashboard/projects/${pr.slug}/preview`,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        href: item.href,
        isPublished: item.isPublished,
        createdAt: item.createdAt.toISOString(),
      }));

    const contentTotal = postsTotal + eventsTotal + guidesTotal + projectsTotal;
    const contentPublished =
      postsPublished + eventsPublished + guidesPublished + projectsPublished;

    return NextResponse.json({
      message: 'Dashboard stats fetched successfully',
      data: {
        period,
        totals: {
          content: contentTotal,
          published: contentPublished,
          drafts: contentTotal - contentPublished,
          media: photosTotal,
        },
        posts: moduleStats(postsTotal, postsPublished, postsFeatured),
        events: moduleStats(eventsTotal, eventsPublished, eventsFeatured),
        guides: moduleStats(guidesTotal, guidesPublished, guidesFeatured),
        projects: moduleStats(
          projectsTotal,
          projectsPublished,
          projectsFeatured,
        ),
        gallery: {
          total: photosTotal,
          published: photosPublished,
          unpublished: photosTotal - photosPublished,
        },
        categories: {
          posts: postCategories,
          events: eventCategories,
          gallery: galleryCategories,
        },
        users: {
          total: usersTotal,
          admins,
          regular: usersTotal - admins,
        },
        recent,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
