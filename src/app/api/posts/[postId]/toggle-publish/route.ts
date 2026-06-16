// src/app/api/posts/[postId]/toggle-publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { revalidatePublishedPosts } from '@/utils/revalidate-posts';

/**
 * PATCH /api/posts/[postId]/toggle-publish
 * Protected — toggles the published status of a post.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
): Promise<NextResponse> {
  try {
    await verifySession();
    const { postId } = await params;

    if (!postId) {
      throw new ValidationError('Valid post ID is required');
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingPost = await tx.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          title: true,
          isPublished: true,
          publishDate: true,
        },
      });

      if (!existingPost) {
        throw new NotFoundError('Post not found');
      }

      const newPublishStatus = !parseBoolean(existingPost.isPublished);

      return tx.post.update({
        where: { id: postId },
        data: {
          isPublished: newPublishStatus,
          publishDate: newPublishStatus ? new Date() : existingPost.publishDate,
        },
        select: {
          id: true,
          title: true,
          isPublished: true,
          publishDate: true,
        },
      });
    });

    revalidatePublishedPosts({ categories: true });

    return NextResponse.json({
      message: `Post "${result.title}" ${
        result.isPublished ? 'published' : 'unpublished'
      } successfully`,
      data: {
        id: result.id,
        title: result.title,
        isPublished: result.isPublished,
        publishDate: result.publishDate,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
