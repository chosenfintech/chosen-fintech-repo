// src/utils/get-post-by-id.ts
import prisma from '@/lib/prisma';
import { NotFoundError, ValidationError } from '@/middlewares/error-handler';

interface GetPostByIdOptions {
  isAuthenticated: boolean;
}

export async function getPostById(
  postId: string,
  { isAuthenticated }: GetPostByIdOptions,
) {
  if (!postId) {
    throw new ValidationError('Post identifier is required');
  }

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id: postId }, { slug: postId }],
      ...(isAuthenticated ? {} : { isPublished: true }),
    },
    include: {
      author: { select: { id: true, fullname: true, email: true } },
      category: { select: { id: true, name: true } },
    },
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  return post;
}
