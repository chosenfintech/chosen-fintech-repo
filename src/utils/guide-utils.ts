// src/utils/guide-utils.ts
import prisma, { Prisma } from '@/lib/prisma';
import { IGuide, IGuidesQueryParams } from '../types/guides/guide.types';

export interface GetGuidesOptions {
  forcePublished?: boolean;
}

const GUIDE_INCLUDE = {
  author: {
    select: {
      id: true,
      fullname: true,
      email: true,
    },
  },
} satisfies Prisma.GuideInclude;

type GuideWithRelations = Prisma.GuideGetPayload<{
  include: typeof GUIDE_INCLUDE;
}>;

export const buildGuideWhereClause = (
  params: IGuidesQueryParams,
  options: GetGuidesOptions = {},
): Prisma.GuideWhereInput => {
  const { authorId, isPublished, isFeatured, level, search } = params;
  const { forcePublished } = options;

  const whereClause: Prisma.GuideWhereInput = {};

  if (authorId) {
    whereClause.authorId = authorId;
  }

  if (level) {
    whereClause.level = level;
  }

  if (forcePublished) {
    whereClause.isPublished = true;
  } else if (isPublished === true) {
    whereClause.isPublished = true;
  } else if (isPublished === false) {
    whereClause.isPublished = false;
  }

  if (isFeatured === true) {
    whereClause.isFeatured = true;
  } else if (isFeatured === false) {
    whereClause.isFeatured = false;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  return whereClause;
};

export const fetchGuidesWithPagination = async (
  whereClause: Prisma.GuideWhereInput,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [guides, total] = await Promise.all([
    prisma.guide.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { publishDate: 'desc' },
      include: GUIDE_INCLUDE,
    }),
    prisma.guide.count({ where: whereClause }),
  ]);

  return { guides, total };
};

export const mapGuidesToResponse = (guides: GuideWithRelations[]): IGuide[] => {
  return guides.map((guide) => ({
    id: guide.id,
    slug: guide.slug,
    title: guide.title,
    description: guide.description,
    content: guide.content,
    readTime: guide.readTime,
    image: guide.image,
    level: guide.level,
    isPublished: guide.isPublished,
    isFeatured: guide.isFeatured,
    publishDate: guide.publishDate,
    createdAt: guide.createdAt,
    updatedAt: guide.updatedAt,
    author: {
      id: guide.author.id,
      fullname: guide.author.fullname,
      email: guide.author.email,
    },
  }));
};
