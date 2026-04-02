// src/utils/post-utils.ts
import prisma, { Prisma } from '../lib/prisma';
import { IPostResponseData, PostQueryParams } from '../types/posts/post.types';

export interface GetPostsOptions {
  forcePublished?: boolean;
}

const POST_INCLUDE = {
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
} satisfies Prisma.PostInclude;

// Type is now derived from the const — single source of truth
type PostWithRelations = Prisma.PostGetPayload<{
  include: typeof POST_INCLUDE;
}>;

export const buildPostWhereClause = (
  params: PostQueryParams,
  options: GetPostsOptions = {},
): Prisma.PostWhereInput => {
  const { categoryId, authorId, isPublished, isFeatured, search } = params;

  const whereClause: Prisma.PostWhereInput = {};

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  if (authorId) {
    whereClause.authorId = authorId;
  }

  if (options.forcePublished) {
    whereClause.isPublished = true;
  } else if (isPublished === 'true') {
    whereClause.isPublished = true;
  }

  if (isFeatured === 'true') {
    whereClause.isFeatured = true;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  return whereClause;
};

export const fetchPostsWithPagination = async (
  whereClause: Prisma.PostWhereInput,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { publishDate: 'desc' },
      include: POST_INCLUDE,
    }),
    prisma.post.count({ where: whereClause }),
  ]);

  return { posts, total };
};

export const mapPostsToResponse = (
  posts: PostWithRelations[],
): IPostResponseData[] => {
  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    readTime: post.readTime,
    coverImage: post.coverImage,
    isPublished: post.isPublished,
    isFeatured: post.isFeatured,
    publishDate: post.publishDate,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      id: post.author.id,
      fullname: post.author.fullname,
      email: post.author.email,
    },
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
        }
      : null,
  }));
};
