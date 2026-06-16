// src/app/api/guides/[guideId]/toggle-featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin } from '@/utils/require-admin';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { revalidatePublishedGuides } from '@/utils/revalidate-guides';

/**
 * PATCH /api/guides/[guideId]/toggle-featured
 * Protected — toggles the featured status of a guide.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ guideId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireAdmin(session);
    const { guideId } = await params;

    if (!guideId) {
      throw new ValidationError('Valid guide ID is required');
    }

    const existingGuide = await prisma.guide.findUnique({
      where: { id: guideId },
      select: {
        id: true,
        title: true,
        isFeatured: true,
      },
    });

    if (!existingGuide) {
      throw new NotFoundError('Guide not found');
    }

    const updatedGuide = await prisma.guide.update({
      where: { id: guideId },
      data: { isFeatured: !existingGuide.isFeatured },
      select: {
        id: true,
        title: true,
        isFeatured: true,
      },
    });

    revalidatePublishedGuides();

    return NextResponse.json({
      message: `Guide "${updatedGuide.title}" ${
        updatedGuide.isFeatured ? 'featured' : 'unfeatured'
      } successfully`,
      data: {
        id: updatedGuide.id,
        title: updatedGuide.title,
        isFeatured: updatedGuide.isFeatured,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
