// src/utils/get-event-categories.ts
import prisma from '@/lib/prisma';
import type { Prisma } from '@/lib/prisma';
import type { IEventCategory } from '@/types/events/category.types';

export interface GetEventCategoriesOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isPublic: boolean;
}

export interface GetEventCategoriesResult {
  categories: IEventCategory[];
  total: number;
}

export async function getEventCategories({
  page,
  limit,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: GetEventCategoriesOptions): Promise<GetEventCategoriesResult> {
  const skip = (page - 1) * limit;

  const whereClause: Prisma.EventCategoryWhereInput = {};

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  const orderBy: Prisma.EventCategoryOrderByWithRelationInput = {};
  if (sortBy === 'eventCount' || sortBy === 'publishedEventCount') {
    orderBy.events = { _count: sortOrder };
  } else if (
    sortBy === 'name' ||
    sortBy === 'createdAt' ||
    sortBy === 'updatedAt'
  ) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [rawCategories, total] = await Promise.all([
    prisma.eventCategory.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            events: { where: { isPublished: true } },
          },
        },
      },
    }),
    prisma.eventCategory.count({ where: whereClause }),
  ]);

  const unpublishedGroups = await prisma.event.groupBy({
    by: ['categoryId'],
    where: {
      categoryId: { in: rawCategories.map((c) => c.id) },
      isPublished: false,
    },
    _count: { id: true },
  });

  const unpublishedCountMap = new Map(
    unpublishedGroups.map((g) => [g.categoryId, g._count.id]),
  );

  const categories: IEventCategory[] = rawCategories.map((category) => {
    const unpublished = unpublishedCountMap.get(category.id) ?? 0;
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      publishedEventsCount: category._count.events,
      unpublishedEventsCount: unpublished,
      totalEventsCount: category._count.events + unpublished,
    };
  });

  if (sortBy === 'totalEventCount') {
    categories.sort((a, b) => {
      const diff = a.totalEventsCount - b.totalEventsCount;
      return sortOrder === 'asc' ? diff : -diff;
    });
  }

  return { categories, total };
}
