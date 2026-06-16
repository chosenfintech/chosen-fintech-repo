// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cloudinaryService } from '@/config/claudinary';
import { generateSlug } from '@/utils/generate-slug';
import { calculateReadTime } from '@/utils/read-time-calculator';
import {
  buildPostWhereClause,
  fetchPostsWithPagination,
  mapPostsToResponse,
} from '@/utils/post-utils';
import type {
  IPostsPaginatedResponse,
  IPostsQueryParams,
} from '@/types/posts/post.types';
import { createPostSchema } from '@/validations/posts/post-validation';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  uploadBase64ContentImages,
  deleteUploadedContentImages,
} from '@/utils/content-images';
import { revalidatePublishedPosts } from '@/utils/revalidate-posts';

const POSTS_UPLOAD_FOLDER = 'chosen-fintech/posts-images';

/**
 * GET /api/posts
 * Protected — returns all posts with pagination and filters (admin use).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IPostsQueryParams = {
      categoryId: searchParams.get('categoryId') ?? undefined,
      authorId: searchParams.get('authorId') ?? undefined,
      isPublished:
        parseBoolean(searchParams.get('isPublished'), null) ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
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
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/posts
 * Protected — creates a new post. Accepts multipart/form-data.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;
  let uploadedContentPublicIds: string[] = [];

  try {
    const session = await verifySession();
    const authorId = session.userId;

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'coverImage') continue;
      rawBody[key] = value;
    }

    const validation = createPostSchema.safeParse(rawBody);

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

    const coverImageFile = formData.get('coverImage');
    if (coverImageFile instanceof File && coverImageFile.size > 0) {
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

    // Upload any inline base64 images in the content to Cloudinary and swap
    // them for hosted URLs before persisting — keeps base64 blobs out of the DB.
    const contentResult = await uploadBase64ContentImages(postDetails.content);
    const processedContent = contentResult.html;
    uploadedContentPublicIds = contentResult.uploadedPublicIds;

    const calculatedReadTime = calculateReadTime(processedContent);

    const result = await prisma.$transaction(async (tx) => {
      if (postDetails.categoryId) {
        const category = await tx.category.findUnique({
          where: { id: postDetails.categoryId },
        });
        if (!category) {
          throw new NotFoundError(
            `Category with ID ${postDetails.categoryId} not found`,
          );
        }
      }

      const isPublished = postDetails.isPublished ?? false;
      const publishDate =
        postDetails.publishDate && isPublished
          ? new Date(postDetails.publishDate)
          : isPublished
            ? new Date()
            : null;

      return tx.post.create({
        data: {
          title: postDetails.title,
          slug: generateSlug(postDetails.title),
          excerpt: postDetails.excerpt,
          content: processedContent,
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
          author: { select: { id: true, fullname: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      });
    });

    revalidatePublishedPosts({ categories: true });

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
  } catch (err) {
    await Promise.all([
      uploadedImageUrl
        ? cloudinaryService
            .deleteImage(uploadedImageUrl)
            .catch((e) => console.error('Cloudinary cleanup failed:', e))
        : Promise.resolve(),
      deleteUploadedContentImages(uploadedContentPublicIds),
    ]);
    return handleApiError(err);
  }
}
