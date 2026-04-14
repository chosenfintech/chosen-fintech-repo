// src/app/api/posts/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cloudinaryService } from '@/config/claudinary';
import { generateSlug } from '@/utils/generate-slug';
import { calculateReadTime } from '@/utils/read-time-calculator';
import { parseBoolean } from '@/utils/parse-booleans';
import type { Prisma } from '@/lib/prisma';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/middlewares/error-handler';
import { updatePostSchema } from '@/validations/posts/post-validation';
import { getPostById } from '@/utils/get-post-by-id';

const POSTS_UPLOAD_FOLDER = 'chosen-fintech/posts-images';

/**
 * GET /api/posts/[postId]
 * - Protected Route: returns any post (published or draft)
 */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
): Promise<NextResponse> {
  try {
    const { postId } = await params;

    await verifySession();

    const post = await getPostById(postId, { isAuthenticated: true });

    return NextResponse.json(
      { message: 'Post retrieved successfully', data: post },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/posts/[postId]
 * Protected — update an existing post. Accepts multipart/form-data.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;

  try {
    await verifySession();
    const { postId } = await params;

    if (!postId) {
      throw new ValidationError('Post ID is required');
    }

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'coverImage') continue;
      rawBody[key] = value;
    }

    for (const key of ['categoryId'] as const) {
      if (rawBody[key] === 'null' || rawBody[key] === 'undefined') {
        rawBody[key] = null;
      }
    }

    const validation = updatePostSchema.safeParse(rawBody);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const postDetails = validation.data;

    let coverImageExplicitlySet = false;
    let coverImageNull = false;

    const coverImageEntry = formData.get('coverImage');
    if (coverImageEntry !== null) {
      coverImageExplicitlySet = true;
      if (
        typeof coverImageEntry === 'string' &&
        (coverImageEntry === 'null' ||
          coverImageEntry === 'undefined' ||
          coverImageEntry === '')
      ) {
        coverImageNull = true;
      } else if (coverImageEntry instanceof File && coverImageEntry.size > 0) {
        const buffer = Buffer.from(await coverImageEntry.arrayBuffer());
        const result = await cloudinaryService.uploadImage(
          {
            buffer,
            originalname: coverImageEntry.name,
            mimetype: coverImageEntry.type,
          },
          { folder: POSTS_UPLOAD_FOLDER },
        );
        uploadedImageUrl = result.secure_url;
      }
    }

    let oldCoverImage: string | null = null;
    let shouldDeleteOldImage = false;

    const result = await prisma.$transaction(async (tx) => {
      const existingPost = await tx.post.findUnique({
        where: { id: postId },
        select: {
          authorId: true,
          coverImage: true,
          isPublished: true,
          publishDate: true,
        },
      });

      if (!existingPost) {
        throw new NotFoundError('Post not found');
      }

      oldCoverImage = existingPost.coverImage;

      if (
        postDetails.categoryId !== undefined &&
        postDetails.categoryId !== null
      ) {
        const category = await tx.category.findUnique({
          where: { id: postDetails.categoryId },
        });
        if (!category) {
          throw new NotFoundError(
            `Category with ID ${postDetails.categoryId} not found`,
          );
        }
      }

      const updateData: Prisma.PostUpdateInput = {};

      if (postDetails.title !== undefined) {
        updateData.title = postDetails.title;
        updateData.slug = generateSlug(postDetails.title);
      }
      if (postDetails.excerpt !== undefined)
        updateData.excerpt = postDetails.excerpt;
      if (postDetails.content !== undefined) {
        updateData.content = postDetails.content;
        updateData.readTime = calculateReadTime(postDetails.content);
      }

      if (postDetails.categoryId !== undefined) {
        updateData.category =
          postDetails.categoryId === null
            ? { disconnect: true }
            : { connect: { id: postDetails.categoryId } };
      }

      if (postDetails.isPublished !== undefined) {
        const isPublished = parseBoolean(postDetails.isPublished);
        updateData.isPublished = isPublished;
        updateData.publishDate = isPublished
          ? postDetails.publishDate !== undefined
            ? new Date(postDetails.publishDate!)
            : (existingPost.publishDate ?? new Date())
          : null;
      } else if (postDetails.publishDate !== undefined) {
        updateData.publishDate = postDetails.publishDate
          ? new Date(postDetails.publishDate)
          : null;
      }

      if (postDetails.isFeatured !== undefined) {
        updateData.isFeatured = parseBoolean(postDetails.isFeatured);
      }

      if (coverImageExplicitlySet) {
        if (coverImageNull) {
          updateData.coverImage = null;
          shouldDeleteOldImage = oldCoverImage !== null;
        } else if (uploadedImageUrl) {
          updateData.coverImage = uploadedImageUrl;
          shouldDeleteOldImage =
            oldCoverImage !== null && oldCoverImage !== uploadedImageUrl;
        }
      }

      if (postDetails.createdAt !== undefined)
        updateData.createdAt = new Date(postDetails.createdAt);
      if (postDetails.updatedAt !== undefined)
        updateData.updatedAt = new Date(postDetails.updatedAt);

      return tx.post.update({
        where: { id: postId },
        data: updateData,
        include: {
          author: { select: { id: true, fullname: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      });
    });

    if (shouldDeleteOldImage && oldCoverImage) {
      await cloudinaryService
        .deleteImage(oldCoverImage)
        .catch((e) => console.warn('Failed to clean up old cover image:', e));
    }

    return NextResponse.json({
      message: 'Post updated successfully',
      data: {
        id: result.id,
        slug: result.slug,
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        readTime: result.readTime,
        coverImage: result.coverImage,
        isPublished: result.isPublished,
        isFeatured: result.isFeatured,
        publishDate: result.publishDate,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        category: result.category ?? null,
      },
    });
  } catch (err) {
    if (uploadedImageUrl) {
      await cloudinaryService
        .deleteImage(uploadedImageUrl)
        .catch((e) => console.error('Cloudinary cleanup failed:', e));
    }
    return handleApiError(err);
  }
}

/**
 * DELETE /api/posts/[postId]
 * Protected — authors can only delete their own posts.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { postId } = await params;

    if (!postId) {
      throw new ValidationError('Post ID is required');
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        authorId: true,
        coverImage: true,
        author: { select: { fullname: true } },
      },
    });

    if (!existingPost) {
      throw new NotFoundError('Post not found');
    }

    if (existingPost.authorId !== session.userId) {
      throw new ForbiddenError('You can only delete your own posts');
    }

    await prisma.post.delete({ where: { id: postId } });

    if (existingPost.coverImage) {
      await cloudinaryService
        .deleteImage(existingPost.coverImage)
        .catch((e) => console.warn('Failed to clean up cover image:', e));
    }

    return NextResponse.json({
      message: `Post "${existingPost.title}" by ${existingPost.author.fullname} deleted successfully`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
