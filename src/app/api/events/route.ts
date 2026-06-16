// src/app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cloudinaryService } from '@/config/claudinary';
import { generateSlug } from '@/utils/generate-slug';
import { calculateReadTime } from '@/utils/read-time-calculator';
import {
  buildEventWhereClause,
  fetchEventsWithPagination,
  mapEventsToResponse,
} from '@/utils/event-utils';
import type {
  IEventsPaginatedResponse,
  IEventsQueryParams,
} from '@/types/events/event.types';
import { createEventSchema } from '@/validations/events/event-validation';
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
import { revalidatePublishedEvents } from '@/utils/revalidate-events';

const POSTS_UPLOAD_FOLDER = 'chosen-fintech/events-images';

/**
 * GET /api/events
 * Protected — returns all events with pagination and filters (admin use).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IEventsQueryParams = {
      categoryId: searchParams.get('categoryId') ?? undefined,
      authorId: searchParams.get('authorId') ?? undefined,
      isPublished:
        parseBoolean(searchParams.get('isPublished'), null) ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildEventWhereClause(queryParams);

    const { events, total } = await fetchEventsWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IEventsPaginatedResponse = {
      message: 'Events retrieved successfully',
      data: mapEventsToResponse(events),
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
 * POST /api/events
 * Protected — creates a new event. Accepts multipart/form-data.
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

    const validation = createEventSchema.safeParse(rawBody);

    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const eventDetails = validation.data;

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
    const contentResult = await uploadBase64ContentImages(eventDetails.content);
    const processedContent = contentResult.html;
    uploadedContentPublicIds = contentResult.uploadedPublicIds;

    const calculatedReadTime = calculateReadTime(processedContent);

    const result = await prisma.$transaction(async (tx) => {
      if (eventDetails.categoryId) {
        const category = await tx.eventCategory.findUnique({
          where: { id: eventDetails.categoryId },
        });
        if (!category) {
          throw new NotFoundError(
            `EventCategory with ID ${eventDetails.categoryId} not found`,
          );
        }
      }

      const isPublished = eventDetails.isPublished ?? false;
      const publishDate =
        eventDetails.publishDate && isPublished
          ? new Date(eventDetails.publishDate)
          : isPublished
            ? new Date()
            : null;

      return tx.event.create({
        data: {
          title: eventDetails.title,
          slug: generateSlug(eventDetails.title),
          excerpt: eventDetails.excerpt,
          content: processedContent,
          readTime: calculatedReadTime,
          coverImage: uploadedImageUrl ?? null,
          isPublished,
          isFeatured: eventDetails.isFeatured ?? false,
          publishDate,
          location: eventDetails.location ?? null,
          startTime: eventDetails.startTime ?? null,
          endTime: eventDetails.endTime ?? null,
          eventDate: eventDetails.eventDate
            ? new Date(eventDetails.eventDate)
            : null,
          authorId,
          ...(eventDetails.categoryId && { categoryId: eventDetails.categoryId }),
          ...(eventDetails.createdAt && {
            createdAt: new Date(eventDetails.createdAt),
          }),
          ...(eventDetails.updatedAt && {
            updatedAt: new Date(eventDetails.updatedAt),
          }),
        },
        include: {
          author: { select: { id: true, fullname: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      });
    });

    revalidatePublishedEvents({ categories: true });

    return NextResponse.json(
      {
        message: 'Event created successfully',
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
          eventDate: result.eventDate,
          location: result.location,
          startTime: result.startTime,
          endTime: result.endTime,
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
