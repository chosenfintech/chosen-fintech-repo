// src/app/api/guides/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin } from '@/utils/require-admin';
import { cloudinaryService } from '@/config/claudinary';
import { generateSlug } from '@/utils/generate-slug';
import { calculateReadTime } from '@/utils/read-time-calculator';
import {
  buildGuideWhereClause,
  fetchGuidesWithPagination,
  mapGuidesToResponse,
} from '@/utils/guide-utils';
import type {
  IGuidesPaginatedResponse,
  IGuidesQueryParams,
  GuideLevel,
} from '@/types/guides/guide.types';
import { createGuideSchema } from '@/validations/guides/guide-validation';
import { handleApiError, ValidationError } from '@/middlewares/error-handler';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  uploadBase64ContentImages,
  deleteUploadedContentImages,
} from '@/utils/content-images';
import { revalidatePublishedGuides } from '@/utils/revalidate-guides';

const GUIDES_UPLOAD_FOLDER = 'chosen-fintech/guides-images';

/**
 * GET /api/guides
 * Protected — returns all guides with pagination and filters (admin use).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IGuidesQueryParams = {
      level: (searchParams.get('level') as GuideLevel) ?? undefined,
      authorId: searchParams.get('authorId') ?? undefined,
      isPublished:
        parseBoolean(searchParams.get('isPublished'), null) ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildGuideWhereClause(queryParams);

    const { guides, total } = await fetchGuidesWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IGuidesPaginatedResponse = {
      message: 'Guides retrieved successfully',
      data: mapGuidesToResponse(guides),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    return NextResponse.json(paginatedResponse);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/guides
 * Protected — creates a new guide. Accepts multipart/form-data.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;
  let uploadedContentPublicIds: string[] = [];

  try {
    const session = await verifySession();
    requireAdmin(session);
    const authorId = session.userId;

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'image') continue;
      rawBody[key] = value;
    }

    const validation = createGuideSchema.safeParse(rawBody);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const guideDetails = validation.data;

    const imageFile = formData.get('image');
    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const result = await cloudinaryService.uploadImage(
        { buffer, originalname: imageFile.name, mimetype: imageFile.type },
        { folder: GUIDES_UPLOAD_FOLDER },
      );
      uploadedImageUrl = result.secure_url;
    }

    // Upload any inline base64 images in the content to Cloudinary.
    const contentResult = await uploadBase64ContentImages(guideDetails.content);
    const processedContent = contentResult.html;
    uploadedContentPublicIds = contentResult.uploadedPublicIds;

    const calculatedReadTime = calculateReadTime(processedContent);

    const isPublished = guideDetails.isPublished ?? false;
    const publishDate =
      guideDetails.publishDate && isPublished
        ? new Date(guideDetails.publishDate)
        : isPublished
          ? new Date()
          : null;

    const result = await prisma.guide.create({
      data: {
        title: guideDetails.title,
        slug: generateSlug(guideDetails.title),
        description: guideDetails.description,
        content: processedContent,
        readTime: calculatedReadTime,
        image: uploadedImageUrl ?? null,
        level: guideDetails.level ?? 'BEGINNER',
        isPublished,
        isFeatured: guideDetails.isFeatured ?? false,
        publishDate,
        authorId,
        ...(guideDetails.createdAt && {
          createdAt: new Date(guideDetails.createdAt),
        }),
        ...(guideDetails.updatedAt && {
          updatedAt: new Date(guideDetails.updatedAt),
        }),
      },
      include: { author: { select: { id: true, fullname: true, email: true } } },
    });

    revalidatePublishedGuides();

    return NextResponse.json(
      {
        message: 'Guide created successfully',
        data: {
          id: result.id,
          slug: result.slug,
          title: result.title,
          description: result.description,
          content: result.content,
          readTime: result.readTime,
          image: result.image,
          level: result.level,
          isPublished: result.isPublished,
          isFeatured: result.isFeatured,
          publishDate: result.publishDate,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          author: result.author,
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
