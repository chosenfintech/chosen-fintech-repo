// src/utils/event-utils.ts
import prisma, { Prisma } from '@/lib/prisma';
import { IEvent, IEventsQueryParams } from '../types/events/event.types';

export interface GetEventsOptions {
  forcePublished?: boolean;
}

const EVENT_INCLUDE = {
  author: {
    select: {
      id: true,
      fullname: true,
      email: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.EventInclude;

type EventWithRelations = Prisma.EventGetPayload<{
  include: typeof EVENT_INCLUDE;
}>;

export const buildEventWhereClause = (
  params: IEventsQueryParams,
  options: GetEventsOptions = {},
): Prisma.EventWhereInput => {
  const { categoryId, authorId, isPublished, isFeatured, search } = params;
  const { forcePublished } = options;

  const whereClause: Prisma.EventWhereInput = {};

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  // --- authorId ---
  if (authorId) {
    whereClause.authorId = authorId;
  }

  // --- isPublished ---
  // forcePublished takes priority — used by public routes to always
  // return only published events regardless of what the client sends.
  // Otherwise, we respect whatever the caller passed explicitly.
  if (forcePublished) {
    whereClause.isPublished = true;
  } else if (isPublished === true) {
    whereClause.isPublished = true;
  } else if (isPublished === false) {
    whereClause.isPublished = false;
  }
  // If isPublished is undefined and forcePublished is false,
  // no isPublished filter is applied — all events are returned (admin use).

  // --- isFeatured ---
  if (isFeatured === true) {
    whereClause.isFeatured = true;
  } else if (isFeatured === false) {
    whereClause.isFeatured = false;
  }

  // --- search ---
  // Searches across title, excerpt, content, and location.
  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  return whereClause;
};

export const fetchEventsWithPagination = async (
  whereClause: Prisma.EventWhereInput,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where: whereClause,
      skip,
      take: limit,
      // Upcoming/most-recent events first; fall back to publish date.
      orderBy: [{ eventDate: 'desc' }, { publishDate: 'desc' }],
      include: EVENT_INCLUDE,
    }),
    prisma.event.count({ where: whereClause }),
  ]);

  return { events, total };
};

export const mapEventsToResponse = (events: EventWithRelations[]): IEvent[] => {
  return events.map((event) => ({
    id: event.id,
    slug: event.slug,
    title: event.title,
    excerpt: event.excerpt,
    content: event.content,
    readTime: event.readTime,
    coverImage: event.coverImage,
    isPublished: event.isPublished,
    isFeatured: event.isFeatured,
    publishDate: event.publishDate,
    eventDate: event.eventDate,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    author: {
      id: event.author.id,
      fullname: event.author.fullname,
      email: event.author.email,
    },
    category: event.category
      ? {
          id: event.category.id,
          name: event.category.name,
        }
      : null,
  }));
};
