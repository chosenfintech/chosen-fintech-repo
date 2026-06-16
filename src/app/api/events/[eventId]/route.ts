// src/app/api/events/[eventId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin } from '@/utils/require-admin';
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
import { updateEventSchema } from '@/validations/events/event-validation';
import { getEventById } from '@/utils/get-event-by-id';
import {
  uploadBase64ContentImages,
  deleteOrphanedContentImages,
  deleteUploadedContentImages,
} from '@/utils/content-images';
import { revalidatePublishedEvents } from '@/utils/revalidate-events';

const POSTS_UPLOAD_FOLDER = 'chosen-fintech/events-images';

/**
 * GET /api/events/[eventId]
 * - Protected Route: returns any event (published or draft)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
): Promise<NextResponse> {
  try {
    const { eventId } = await params;

    await verifySession();

    const event = await getEventById(eventId, { isAuthenticated: true });

    return NextResponse.json(
      { message: 'Event retrieved successfully', data: event },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/events/[eventId]
 * Protected — update an existing event. Accepts multipart/form-data.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;
  let uploadedContentPublicIds: string[] = [];

  try {
    const session = await verifySession();
    requireAdmin(session);
    const { eventId } = await params;

    if (!eventId) {
      throw new ValidationError('Event ID is required');
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

    const validation = updateEventSchema.safeParse(rawBody);
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

    // Upload any inline base64 images in the new content to Cloudinary and
    // swap them for hosted URLs before persisting.
    let processedContent: string | undefined;
    if (eventDetails.content !== undefined) {
      const contentResult = await uploadBase64ContentImages(
        eventDetails.content,
      );
      processedContent = contentResult.html;
      uploadedContentPublicIds = contentResult.uploadedPublicIds;
    }

    let oldCoverImage: string | null = null;
    let oldContent: string | null = null;
    let shouldDeleteOldImage = false;

    const result = await prisma.$transaction(async (tx) => {
      const existingEvent = await tx.event.findUnique({
        where: { id: eventId },
        select: {
          authorId: true,
          coverImage: true,
          content: true,
          isPublished: true,
          publishDate: true,
        },
      });

      if (!existingEvent) {
        throw new NotFoundError('Event not found');
      }

      oldCoverImage = existingEvent.coverImage;
      oldContent = existingEvent.content; // captured for orphan cleanup after commit

      if (
        eventDetails.categoryId !== undefined &&
        eventDetails.categoryId !== null
      ) {
        const category = await tx.eventCategory.findUnique({
          where: { id: eventDetails.categoryId },
        });
        if (!category) {
          throw new NotFoundError(
            `EventCategory with ID ${eventDetails.categoryId} not found`,
          );
        }
      }

      const updateData: Prisma.EventUpdateInput = {};

      if (eventDetails.title !== undefined) {
        updateData.title = eventDetails.title;
        updateData.slug = generateSlug(eventDetails.title);
      }
      if (eventDetails.excerpt !== undefined)
        updateData.excerpt = eventDetails.excerpt;
      if (eventDetails.content !== undefined) {
        updateData.content = processedContent;
        updateData.readTime = calculateReadTime(processedContent!);
      }

      if (eventDetails.categoryId !== undefined) {
        updateData.category =
          eventDetails.categoryId === null
            ? { disconnect: true }
            : { connect: { id: eventDetails.categoryId } };
      }

      if (eventDetails.isPublished !== undefined) {
        const isPublished = parseBoolean(eventDetails.isPublished);
        updateData.isPublished = isPublished;
        updateData.publishDate = isPublished
          ? eventDetails.publishDate !== undefined
            ? new Date(eventDetails.publishDate!)
            : (existingEvent.publishDate ?? new Date())
          : null;
      } else if (eventDetails.publishDate !== undefined) {
        updateData.publishDate = eventDetails.publishDate
          ? new Date(eventDetails.publishDate)
          : null;
      }

      if (eventDetails.isFeatured !== undefined) {
        updateData.isFeatured = parseBoolean(eventDetails.isFeatured);
      }

      if (eventDetails.eventDate !== undefined) {
        updateData.eventDate = eventDetails.eventDate
          ? new Date(eventDetails.eventDate)
          : null;
      }
      if (eventDetails.location !== undefined)
        updateData.location = eventDetails.location;
      if (eventDetails.startTime !== undefined)
        updateData.startTime = eventDetails.startTime;
      if (eventDetails.endTime !== undefined)
        updateData.endTime = eventDetails.endTime;

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

      if (eventDetails.createdAt !== undefined)
        updateData.createdAt = new Date(eventDetails.createdAt);
      if (eventDetails.updatedAt !== undefined)
        updateData.updatedAt = new Date(eventDetails.updatedAt);

      return tx.event.update({
        where: { id: eventId },
        data: updateData,
        include: {
          author: { select: { id: true, fullname: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      });
    });

    // Transaction committed — now run Cloudinary side-effects.
    await Promise.all([
      // Delete old cover image if it was replaced or cleared
      shouldDeleteOldImage && oldCoverImage
        ? cloudinaryService
            .deleteImage(oldCoverImage)
            .catch((e) =>
              console.warn('Failed to clean up old cover image:', e),
            )
        : Promise.resolve(),

      // Delete content images that were in the old content but not in the new
      oldContent && processedContent !== undefined
        ? deleteOrphanedContentImages(oldContent, processedContent)
        : Promise.resolve(),
    ]);

    revalidatePublishedEvents({ categories: true });

    return NextResponse.json({
      message: 'Event updated successfully',
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
    });
  } catch (err) {
    // Roll back both the new cover image and any newly uploaded content images
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

/**
 * DELETE /api/events/[eventId]
 * Protected — authors can only delete their own events.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { eventId } = await params;

    if (!eventId) {
      throw new ValidationError('Event ID is required');
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        authorId: true,
        coverImage: true,
        author: { select: { fullname: true } },
      },
    });

    if (!existingEvent) {
      throw new NotFoundError('Event not found');
    }

    if (!session.isAdmin && existingEvent.authorId !== session.userId) {
      throw new ForbiddenError('You can only delete your own events');
    }

    await prisma.event.delete({ where: { id: eventId } });

    if (existingEvent.coverImage) {
      await cloudinaryService
        .deleteImage(existingEvent.coverImage)
        .catch((e) => console.warn('Failed to clean up cover image:', e));
    }

    revalidatePublishedEvents({ categories: true });

    return NextResponse.json({
      message: `Event "${existingEvent.title}" by ${existingEvent.author.fullname} deleted successfully`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
