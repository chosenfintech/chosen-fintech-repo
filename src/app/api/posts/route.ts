// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/data-access-layer';
import { cloudinaryService } from '@/config/claudinary';
import { generateSlug } from '@/utils/generate-slug';
import { calculateReadTime } from '@/utils/read-time-calculator';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  buildPostWhereClause,
  fetchPostsWithPagination,
  mapPostsToResponse,
} from '@/utils/post-utils';
import { z } from 'zod';
import type {
  IPostsPaginatedResponse,
  PostQueryParams,
} from '@/types/posts/post.types';

const POSTS_UPLOAD_FOLDER = 'mhp-website/posts-images';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  isPublished: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => (v !== undefined ? parseBoolean(v) : false)),
  isFeatured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => (v !== undefined ? parseBoolean(v) : false)),
  publishDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .or(z.literal('')),
  categoryId: z
    .string()
    .regex(uuidRegex, 'Category ID must be a valid UUID')
    .optional(),
  tagIds: z
    .array(z.string().regex(uuidRegex, 'Each tag ID must be a valid UUID'))
    .optional(),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});

/**
 * GET /api/posts
 * Public — returns all posts with pagination and filters.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: PostQueryParams = {
      categoryId: searchParams.get('categoryId') ?? undefined,
      authorId: searchParams.get('authorId') ?? undefined,
      isPublished: searchParams.get('isPublished') ?? undefined,
      isFeatured: searchParams.get('isFeatured') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildPostWhereClause(queryParams);
    const { posts, total } = await fetchPostsWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IPostsPaginatedResponse = {
      message: 'Posts retrieved successfully',
      data: mapPostsToResponse(posts),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(paginatedResponse);
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/posts
 * Protected — creates a new post. Accepts multipart/form-data.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;

  try {
    const session = await verifySession();
    const authorId = session.userId;

    const formData = await req.formData();

    // Extract fields from FormData into a plain object for Zod
    const rawBody: Record<string, unknown> = {};

    for (const [key] of formData.entries()) {
      if (key === 'coverImage') continue; // handled separately below
    }

    const validation = createPostSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const postDetails = validation.data;

    // Handle coverImage file upload
    const coverImageFile = formData.get('coverImage');
    if (
      coverImageFile &&
      coverImageFile instanceof File &&
      coverImageFile.size > 0
    ) {
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      const result = await cloudinaryService.uploadImage(
        {
          buffer,
          originalname: coverImageFile.name,
          mimetype: coverImageFile.type,
        },
        { folder: POSTS_UPLOAD_FOLDER },
      );
      uploadedImageUrl = result.secure_url;
    }

    const calculatedReadTime = calculateReadTime(postDetails.content);

    const result = await prisma.$transaction(async (tx) => {
      // Validate category exists
      if (postDetails.categoryId) {
        const category = await tx.category.findUnique({
          where: { id: postDetails.categoryId },
        });
        if (!category) {
          throw Object.assign(new Error('Category not found'), {
            statusCode: 404,
          });
        }
      }

      const isPublished = postDetails.isPublished ?? false;
      const publishDate =
        postDetails.publishDate && isPublished
          ? new Date(postDetails.publishDate)
          : isPublished
            ? new Date()
            : null;

      const post = await tx.post.create({
        data: {
          title: postDetails.title,
          slug: generateSlug(postDetails.title),
          excerpt: postDetails.excerpt,
          content: postDetails.content,
          readTime: calculatedReadTime,
          coverImage: uploadedImageUrl ?? null,
          isPublished,
          isFeatured: postDetails.isFeatured ?? false,
          publishDate,
          authorId,
          ...(postDetails.categoryId && { categoryId: postDetails.categoryId }),
          ...(postDetails.createdAt && {
            createdAt: new Date(postDetails.createdAt),
          }),
          ...(postDetails.updatedAt && {
            updatedAt: new Date(postDetails.updatedAt),
          }),
        },
        include: {
          author: {
            select: { id: true, fullname: true, email: true },
          },
          category: { select: { id: true, name: true } },
        },
      });

      return post;
    });

    return NextResponse.json(
      {
        message: 'Post created successfully',
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
      },
      { status: 201 },
    );
  } catch (error) {
    // Clean up uploaded image if transaction failed
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

    console.error('POST /api/posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
