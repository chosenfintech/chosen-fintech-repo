// src/app/api/guides/[guideId]/route.ts
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
import { updateGuideSchema } from '@/validations/guides/guide-validation';
import { getGuideById } from '@/utils/get-guide-by-id';
import {
  uploadBase64ContentImages,
  deleteOrphanedContentImages,
  deleteUploadedContentImages,
} from '@/utils/content-images';
import { revalidatePublishedGuides } from '@/utils/revalidate-guides';

const GUIDES_UPLOAD_FOLDER = 'chosen-fintech/guides-images';

/**
 * GET /api/guides/[guideId]
 * Protected — returns any guide (published or draft).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ guideId: string }> },
): Promise<NextResponse> {
  try {
    const { guideId } = await params;
    await verifySession();

    const guide = await getGuideById(guideId, { isAuthenticated: true });

    return NextResponse.json(
      { message: 'Guide retrieved successfully', data: guide },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/guides/[guideId]
 * Protected — update an existing guide. Accepts multipart/form-data.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ guideId: string }> },
): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;
  let uploadedContentPublicIds: string[] = [];

  try {
    const session = await verifySession();
    requireAdmin(session);
    const { guideId } = await params;

    if (!guideId) {
      throw new ValidationError('Guide ID is required');
    }

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'image') continue;
      rawBody[key] = value;
    }

    const validation = updateGuideSchema.safeParse(rawBody);
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

    let imageExplicitlySet = false;
    let imageNull = false;

    const imageEntry = formData.get('image');
    if (imageEntry !== null) {
      imageExplicitlySet = true;
      if (
        typeof imageEntry === 'string' &&
        (imageEntry === 'null' ||
          imageEntry === 'undefined' ||
          imageEntry === '')
      ) {
        imageNull = true;
      } else if (imageEntry instanceof File && imageEntry.size > 0) {
        const buffer = Buffer.from(await imageEntry.arrayBuffer());
        const result = await cloudinaryService.uploadImage(
          {
            buffer,
            originalname: imageEntry.name,
            mimetype: imageEntry.type,
          },
          { folder: GUIDES_UPLOAD_FOLDER },
        );
        uploadedImageUrl = result.secure_url;
      }
    }

    let processedContent: string | undefined;
    if (guideDetails.content !== undefined) {
      const contentResult = await uploadBase64ContentImages(
        guideDetails.content,
      );
      processedContent = contentResult.html;
      uploadedContentPublicIds = contentResult.uploadedPublicIds;
    }

    let oldImage: string | null = null;
    let oldContent: string | null = null;
    let shouldDeleteOldImage = false;

    const result = await prisma.$transaction(async (tx) => {
      const existingGuide = await tx.guide.findUnique({
        where: { id: guideId },
        select: {
          authorId: true,
          image: true,
          content: true,
          isPublished: true,
          publishDate: true,
        },
      });

      if (!existingGuide) {
        throw new NotFoundError('Guide not found');
      }

      oldImage = existingGuide.image;
      oldContent = existingGuide.content;

      const updateData: Prisma.GuideUpdateInput = {};

      if (guideDetails.title !== undefined) {
        updateData.title = guideDetails.title;
        updateData.slug = generateSlug(guideDetails.title);
      }
      if (guideDetails.description !== undefined)
        updateData.description = guideDetails.description;
      if (guideDetails.content !== undefined) {
        updateData.content = processedContent;
        updateData.readTime = calculateReadTime(processedContent!);
      }
      if (guideDetails.level !== undefined && guideDetails.level !== null) {
        updateData.level = guideDetails.level;
      }

      if (guideDetails.isPublished !== undefined) {
        const isPublished = parseBoolean(guideDetails.isPublished);
        updateData.isPublished = isPublished;
        updateData.publishDate = isPublished
          ? guideDetails.publishDate !== undefined
            ? new Date(guideDetails.publishDate!)
            : (existingGuide.publishDate ?? new Date())
          : null;
      } else if (guideDetails.publishDate !== undefined) {
        updateData.publishDate = guideDetails.publishDate
          ? new Date(guideDetails.publishDate)
          : null;
      }

      if (guideDetails.isFeatured !== undefined) {
        updateData.isFeatured = parseBoolean(guideDetails.isFeatured);
      }

      if (imageExplicitlySet) {
        if (imageNull) {
          updateData.image = null;
          shouldDeleteOldImage = oldImage !== null;
        } else if (uploadedImageUrl) {
          updateData.image = uploadedImageUrl;
          shouldDeleteOldImage =
            oldImage !== null && oldImage !== uploadedImageUrl;
        }
      }

      if (guideDetails.createdAt !== undefined)
        updateData.createdAt = new Date(guideDetails.createdAt);
      if (guideDetails.updatedAt !== undefined)
        updateData.updatedAt = new Date(guideDetails.updatedAt);

      return tx.guide.update({
        where: { id: guideId },
        data: updateData,
        include: {
          author: { select: { id: true, fullname: true, email: true } },
        },
      });
    });

    await Promise.all([
      shouldDeleteOldImage && oldImage
        ? cloudinaryService
            .deleteImage(oldImage)
            .catch((e) => console.warn('Failed to clean up old image:', e))
        : Promise.resolve(),
      oldContent && processedContent !== undefined
        ? deleteOrphanedContentImages(oldContent, processedContent)
        : Promise.resolve(),
    ]);

    revalidatePublishedGuides();

    return NextResponse.json({
      message: 'Guide updated successfully',
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
    });
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

/**
 * DELETE /api/guides/[guideId]
 * Protected — authors can only delete their own guides.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ guideId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { guideId } = await params;

    if (!guideId) {
      throw new ValidationError('Guide ID is required');
    }

    const existingGuide = await prisma.guide.findUnique({
      where: { id: guideId },
      select: {
        id: true,
        title: true,
        authorId: true,
        image: true,
        author: { select: { fullname: true } },
      },
    });

    if (!existingGuide) {
      throw new NotFoundError('Guide not found');
    }

    if (!session.isAdmin && existingGuide.authorId !== session.userId) {
      throw new ForbiddenError('You can only delete your own guides');
    }

    await prisma.guide.delete({ where: { id: guideId } });

    if (existingGuide.image) {
      await cloudinaryService
        .deleteImage(existingGuide.image)
        .catch((e) => console.warn('Failed to clean up image:', e));
    }

    revalidatePublishedGuides();

    return NextResponse.json({
      message: `Guide "${existingGuide.title}" by ${existingGuide.author.fullname} deleted successfully`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
