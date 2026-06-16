// src/app/api/guides/[guideId]/toggle-publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { revalidatePublishedGuides } from '@/utils/revalidate-guides';

/**
 * PATCH /api/guides/[guideId]/toggle-publish
 * Protected — toggles the published status of a guide.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ guideId: string }> },
): Promise<NextResponse> {
  try {
    await verifySession();
    const { guideId } = await params;

    if (!guideId) {
      throw new ValidationError('Valid guide ID is required');
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingGuide = await tx.guide.findUnique({
        where: { id: guideId },
        select: {
          id: true,
          title: true,
          isPublished: true,
          publishDate: true,
        },
      });

      if (!existingGuide) {
        throw new NotFoundError('Guide not found');
      }

      const newPublishStatus = !parseBoolean(existingGuide.isPublished);

      return tx.guide.update({
        where: { id: guideId },
        data: {
          isPublished: newPublishStatus,
          publishDate: newPublishStatus ? new Date() : existingGuide.publishDate,
        },
        select: {
          id: true,
          title: true,
          isPublished: true,
          publishDate: true,
        },
      });
    });

    revalidatePublishedGuides();

    return NextResponse.json({
      message: `Guide "${result.title}" ${
        result.isPublished ? 'published' : 'unpublished'
      } successfully`,
      data: {
        id: result.id,
        title: result.title,
        isPublished: result.isPublished,
        publishDate: result.publishDate,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
