// src/utils/post-utils.ts
import prisma, { Prisma } from '@/lib/prisma';
import { IPost, IPostsQueryParams } from '../types/posts/post.types';

export const BLOG_AND_EDUCATION_CATEGORY_NAMES = ['blog', 'education'];

export interface GetPostsOptions {
  forcePublished?: boolean;
  postType?: 'events' | 'blog-and-education';
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

type PostWithRelations = Prisma.PostGetPayload<{
  include: typeof POST_INCLUDE;
}>;

export const buildPostWhereClause = (
  params: IPostsQueryParams,
  options: GetPostsOptions = {},
): Prisma.PostWhereInput => {
  const { categoryId, authorId, isPublished, isFeatured, search } = params;
  const { forcePublished, postType } = options;

  const whereClause: Prisma.PostWhereInput = {};

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  // --- authorId ---
  if (authorId) {
    whereClause.authorId = authorId;
  }

  // --- isPublished ---
  // forcePublished takes priority — used by public routes to always
  // return only published posts regardless of what the client sends.
  // Otherwise, we respect whatever the caller passed explicitly.
  if (forcePublished) {
    whereClause.isPublished = true;
  } else if (isPublished === true) {
    whereClause.isPublished = true;
  } else if (isPublished === false) {
    whereClause.isPublished = false;
  }
  // If isPublished is undefined and forcePublished is false,
  // no isPublished filter is applied — all posts are returned (admin use).

  // --- isFeatured ---
  if (isFeatured === true) {
    whereClause.isFeatured = true;
  } else if (isFeatured === false) {
    whereClause.isFeatured = false;
  }

  // --- postType / category scope ---
  // blog-and-education: only return posts whose category name is
  // 'blog' OR 'education' (case-insensitive).
  //
  // events: only return posts whose category is NOT 'blog' or 'education'.
  // Posts with NO category (null) also pass this filter naturally,
  // because a null relation never matches the NOT condition.
  if (postType === 'blog-and-education') {
    whereClause.category = {
      name: {
        in: BLOG_AND_EDUCATION_CATEGORY_NAMES,
        mode: 'insensitive',
      },
    };
  } else if (postType === 'events') {
    whereClause.NOT = {
      category: {
        name: {
          in: BLOG_AND_EDUCATION_CATEGORY_NAMES,
          mode: 'insensitive',
        },
      },
    };
  }

  // --- search ---
  // Searches across title, excerpt, and content.
  // Because the category scope above uses `category` and `NOT` keys,
  // and search uses `OR`, there is no key conflict at the top level.
  // Prisma applies all top-level keys as implicit AND conditions,
  // so the category filter and the search filter both apply together.
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

export const mapPostsToResponse = (posts: PostWithRelations[]): IPost[] => {
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
