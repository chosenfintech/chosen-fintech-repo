// src/app/api/posts/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/data-access-layer';
import { cloudinaryService } from '@/config/claudinary';
import { generateSlug } from '@/utils/generate-slug';
import { calculateReadTime } from '@/utils/read-time-calculator';
import { parseBoolean } from '@/utils/parse-booleans';
import { z } from 'zod';
import type { Prisma } from '@/lib/prisma';

const POSTS_UPLOAD_FOLDER = 'chosen-fintech/posts-images';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  excerpt: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  isPublished: z.union([z.boolean(), z.string()]).optional(),
  isFeatured: z.union([z.boolean(), z.string()]).optional(),
  publishDate: z.string().datetime({ offset: true }).optional().nullable(),
  categoryId: z
    .string()
    .regex(uuidRegex, 'Category ID must be a valid UUID')
    .optional()
    .nullable(),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
  // coverImage is handled separately from FormData — not part of Zod schema
});

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
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'coverImage') continue;
      rawBody[key] = value;
    }

    // Normalise null-like strings for nullable fields before validation
    for (const key of ['categoryId'] as const) {
      if (rawBody[key] === 'null' || rawBody[key] === 'undefined') {
        rawBody[key] = null;
      }
    }

    const validation = updatePostSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const postDetails = validation.data;

    // Resolve coverImage intent from FormData
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
        throw Object.assign(new Error('Post not found'), { statusCode: 404 });
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
          throw Object.assign(
            new Error(`Category with ID ${postDetails.categoryId} not found`),
            { statusCode: 404 },
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
  } catch (error) {
    if (uploadedImageUrl) {
      await cloudinaryService
        .deleteImage(uploadedImageUrl)
        .catch((e) => console.error('Cloudinary cleanup failed:', e));
    }

    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 404) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 404 },
      );
    }
    if (statusCode === 400) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 },
      );
    }

    console.error('PUT /api/posts/[postId] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/posts/[postId]
 * Public — fetch a single post by UUID or slug.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
): Promise<NextResponse> {
  try {
    const { postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post identifier is required' },
        { status: 400 },
      );
    }

    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id: postId }, { slug: postId }],
      },
      include: {
        author: { select: { id: true, fullname: true, email: true } },
        category: { select: { id: true, name: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Post retrieved successfully',
      data: post,
    });
  } catch (error) {
    console.error('GET /api/posts/[postId] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/posts/[postId]
 * Protected — deletes a post. Authors can only delete their own posts.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 },
      );
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
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own posts' },
        { status: 403 },
      );
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
  } catch (error) {
    console.error('DELETE /api/posts/[postId] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
