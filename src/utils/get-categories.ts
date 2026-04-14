// src/utils/get-categories.ts
import prisma from '@/lib/prisma';
import type { Prisma } from '@/lib/prisma';
import type { ICategory } from '@/types/posts/category.types';
import { BLOG_AND_EDUCATION_CATEGORY_NAMES } from '@/utils/post-utils';

export interface GetCategoriesOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  postType?: string;
  isPublic: boolean;
}

export interface GetCategoriesResult {
  categories: ICategory[];
  total: number;
}

export async function getCategories({
  page,
  limit,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  postType,
}: GetCategoriesOptions): Promise<GetCategoriesResult> {
  const skip = (page - 1) * limit;

  const whereClause: Prisma.CategoryWhereInput = {};

  if (postType === 'events') {
    whereClause.NOT = {
      name: { in: BLOG_AND_EDUCATION_CATEGORY_NAMES, mode: 'insensitive' },
    };
  } else if (postType === 'blog-and-education') {
    whereClause.name = {
      in: BLOG_AND_EDUCATION_CATEGORY_NAMES,
      mode: 'insensitive',
    };
  }

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  const orderBy: Prisma.CategoryOrderByWithRelationInput = {};
  if (sortBy === 'postCount' || sortBy === 'publishedPostCount') {
    orderBy.posts = { _count: sortOrder };
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
    prisma.category.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            posts: { where: { isPublished: true } },
          },
        },
      },
    }),
    prisma.category.count({ where: whereClause }),
  ]);

  const unpublishedGroups = await prisma.post.groupBy({
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

  const categories: ICategory[] = rawCategories.map((category) => {
    const unpublished = unpublishedCountMap.get(category.id) ?? 0;
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      publishedPostsCount: category._count.posts,
      unpublishedPostsCount: unpublished,
      totalPostsCount: category._count.posts + unpublished,
    };
  });

  if (sortBy === 'totalPostCount') {
    categories.sort((a, b) => {
      const diff = a.totalPostsCount - b.totalPostsCount;
      return sortOrder === 'asc' ? diff : -diff;
    });
  }

  return { categories, total };
}
