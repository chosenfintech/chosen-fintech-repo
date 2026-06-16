// src/utils/project-utils.ts
import prisma, { Prisma } from '@/lib/prisma';
import { IProject, IProjectsQueryParams } from '../types/projects/project.types';

export interface GetProjectsOptions {
  forcePublished?: boolean;
}

const PROJECT_INCLUDE = {
  author: {
    select: {
      id: true,
      fullname: true,
      email: true,
    },
  },
} satisfies Prisma.ProjectInclude;

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: typeof PROJECT_INCLUDE;
}>;

export const buildProjectWhereClause = (
  params: IProjectsQueryParams,
  options: GetProjectsOptions = {},
): Prisma.ProjectWhereInput => {
  const { authorId, isPublished, isFeatured, search } = params;
  const { forcePublished } = options;

  const whereClause: Prisma.ProjectWhereInput = {};

  if (authorId) {
    whereClause.authorId = authorId;
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

export const fetchProjectsWithPagination = async (
  whereClause: Prisma.ProjectWhereInput,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { publishDate: 'desc' },
      include: PROJECT_INCLUDE,
    }),
    prisma.project.count({ where: whereClause }),
  ]);

  return { projects, total };
};

export const mapProjectsToResponse = (
  projects: ProjectWithRelations[],
): IProject[] => {
  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    content: project.content,
    readTime: project.readTime,
    imageUrl: project.imageUrl,
    isPublished: project.isPublished,
    isFeatured: project.isFeatured,
    publishDate: project.publishDate,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    author: {
      id: project.author.id,
      fullname: project.author.fullname,
      email: project.author.email,
    },
  }));
};
