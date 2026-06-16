// src/app/api/gallery/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma, { Prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin, requireStaff } from '@/utils/require-admin';
import { revalidatePublishedGallery } from '@/utils/revalidate-gallery';
import { cloudinaryService } from '@/config/claudinary';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  GALLERY_PHOTO_INCLUDE,
  mapGalleryPhotoToResponse,
} from '@/utils/gallery-photo-utils';
import { updateGalleryPhotoSchema } from '@/validations/gallery/gallery-photo-validation';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { getGalleryPhotoById } from '@/utils/get-gallery-photo-by-id';

/**
 * GET /api/gallery/photos/[photoId]
 * - Authenticated: returns any photo (published or unpublished)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> },
): Promise<NextResponse> {
  try {
    const { photoId } = await params;

    await verifySession();

    const photo = await getGalleryPhotoById(photoId, { isAuthenticated: true });

    return NextResponse.json(
      { message: 'Gallery photo retrieved successfully', data: photo },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/gallery/photos/[photoId]
 * Protected — updates metadata (altText, caption, isPublished) of a gallery photo.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireStaff(session);

    const { photoId } = await params;

    if (!photoId) {
      throw new ValidationError('Photo ID is required');
    }

    const body = await req.json();

    const validation = updateGalleryPhotoSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const photoDetails = validation.data;

    const existingPhoto = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
      select: { id: true },
    });

    if (!existingPhoto) {
      throw new NotFoundError('Gallery photo not found');
    }

    const updateData: Prisma.GalleryPhotoUpdateInput = {};

    if (photoDetails.altText !== undefined) {
      updateData.altText = photoDetails.altText;
    }

    if (photoDetails.caption !== undefined) {
      updateData.caption = photoDetails.caption;
    }

    if (photoDetails.isPublished !== undefined) {
      updateData.isPublished = parseBoolean(photoDetails.isPublished);
    }

    const updatedPhoto = await prisma.galleryPhoto.update({
      where: { id: photoId },
      data: updateData,
      include: GALLERY_PHOTO_INCLUDE,
    });

    revalidatePublishedGallery();

    return NextResponse.json({
      message: 'Gallery photo updated successfully',
      data: mapGalleryPhotoToResponse(updatedPhoto),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/gallery/photos/[photoId]
 * Protected — deletes a gallery photo and removes it from Cloudinary.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireAdmin(session);

    const { photoId } = await params;

    if (!photoId) {
      throw new ValidationError('Photo ID is required');
    }

    const existingPhoto = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
      select: { id: true, url: true },
    });

    if (!existingPhoto) {
      throw new NotFoundError('Gallery photo not found');
    }

    await prisma.galleryPhoto.delete({ where: { id: photoId } });

    await cloudinaryService
      .deleteImage(existingPhoto.url)
      .catch((e) => console.warn('Failed to clean up gallery image:', e));

    revalidatePublishedGallery();

    return NextResponse.json({
      message: 'Gallery photo deleted successfully',
    });
  } catch (err) {
    return handleApiError(err);
  }
}
