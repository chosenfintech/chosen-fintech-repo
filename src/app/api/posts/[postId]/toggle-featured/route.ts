// src/app/api/posts/[postId]/toggle-featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { revalidatePublishedPosts } from '@/utils/revalidate-posts';

/**
 * PATCH /api/posts/[postId]/toggle-featured
 * Protected — toggles the featured status of a post.
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

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        isFeatured: true,
      },
    });

    if (!existingPost) {
      throw new NotFoundError('Post not found');
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { isFeatured: !existingPost.isFeatured },
      select: {
        id: true,
        title: true,
        isFeatured: true,
      },
    });

    revalidatePublishedPosts();

    return NextResponse.json({
      message: `Post "${updatedPost.title}" ${
        updatedPost.isFeatured ? 'featured' : 'unfeatured'
      } successfully`,
      data: {
        id: updatedPost.id,
        title: updatedPost.title,
        isFeatured: updatedPost.isFeatured,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
