// src/app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { handleApiError } from '@/middlewares/error-handler';
import type {
  DashboardPeriod,
  IRecentContentItem,
} from '@/types/dashboard.types';

type DateRange = { gte: Date; lte: Date };

function getDateRange(
  period: DashboardPeriod,
  from?: string | null,
  to?: string | null,
): DateRange | undefined {
  if (period === 'all_time') return undefined;

  if (period === 'custom') {
    if (!from || !to) return undefined;
    const gte = new Date(from);
    const to0 = new Date(to);
    if (Number.isNaN(gte.getTime()) || Number.isNaN(to0.getTime())) {
      return undefined;
    }
    // Include the whole "to" day.
    const lte = new Date(to0.getFullYear(), to0.getMonth(), to0.getDate(), 23, 59, 59, 999);
    return { gte, lte };
  }

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

/** The equal-length window immediately before the given range. */
function previousRange(range: DateRange): DateRange {
  const durationMs = range.lte.getTime() - range.gte.getTime();
  const prevLte = new Date(range.gte.getTime() - 1);
  const prevGte = new Date(prevLte.getTime() - durationMs);
  return { gte: prevGte, lte: prevLte };
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
      'custom',
    ];
    const period: DashboardPeriod = validPeriods.includes(
      rawPeriod as DashboardPeriod,
    )
      ? (rawPeriod as DashboardPeriod)
      : 'all_time';

    const dateRange = getDateRange(
      period,
      searchParams.get('from'),
      searchParams.get('to'),
    );
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
      prisma.user.count({ where: { ...where, role: 'ADMIN' } }),
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

    // Trend baseline: same metrics for the immediately-preceding equal window.
    // Only meaningful for a bounded range (not "all time").
    let previousTotals = null as {
      content: number;
      published: number;
      drafts: number;
      media: number;
    } | null;

    if (dateRange) {
      const prev = previousRange(dateRange);
      const prevWhere = { createdAt: prev };
      const [
        pPosts,
        pEvents,
        pGuides,
        pProjects,
        pPostsPub,
        pEventsPub,
        pGuidesPub,
        pProjectsPub,
        pPhotos,
      ] = await prisma.$transaction([
        prisma.post.count({ where: prevWhere }),
        prisma.event.count({ where: prevWhere }),
        prisma.guide.count({ where: prevWhere }),
        prisma.project.count({ where: prevWhere }),
        prisma.post.count({ where: { ...prevWhere, isPublished: true } }),
        prisma.event.count({ where: { ...prevWhere, isPublished: true } }),
        prisma.guide.count({ where: { ...prevWhere, isPublished: true } }),
        prisma.project.count({ where: { ...prevWhere, isPublished: true } }),
        prisma.galleryPhoto.count({ where: prevWhere }),
      ]);
      const prevContent = pPosts + pEvents + pGuides + pProjects;
      const prevPublished = pPostsPub + pEventsPub + pGuidesPub + pProjectsPub;
      previousTotals = {
        content: prevContent,
        published: prevPublished,
        drafts: prevContent - prevPublished,
        media: pPhotos,
      };
    }

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
        previousTotals,
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
