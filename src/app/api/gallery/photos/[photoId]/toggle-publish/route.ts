// src/app/api/gallery/photos/[photoId]/toggle-publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';

/**
 * PATCH /api/gallery/photos/[photoId]/toggle-publish
 * Protected — toggles the published status of a gallery photo.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> },
): Promise<NextResponse> {
  try {
    await verifySession();

    const { photoId } = await params;

    if (!photoId) {
      throw new ValidationError('Photo ID is required');
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingPhoto = await tx.galleryPhoto.findUnique({
        where: { id: photoId },
        select: { id: true, isPublished: true },
      });

      if (!existingPhoto) {
        throw new NotFoundError('Gallery photo not found');
      }

      return tx.galleryPhoto.update({
        where: { id: photoId },
        data: { isPublished: !existingPhoto.isPublished },
        select: { id: true, isPublished: true, url: true },
      });
    });

    return NextResponse.json({
      message: `Gallery photo ${result.isPublished ? 'published' : 'unpublished'} successfully`,
      data: {
        id: result.id,
        isPublished: result.isPublished,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
