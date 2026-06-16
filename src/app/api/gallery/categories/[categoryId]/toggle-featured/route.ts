// src/app/api/gallery/categories/[categoryId]/toggle-featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireStaff } from '@/utils/require-admin';
import { revalidatePublishedGallery } from '@/utils/revalidate-gallery';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';

/**
 * PATCH /api/gallery/categories/[categoryId]/toggle-featured
 * Protected — toggles the featured status of a gallery category.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireStaff(session);

    const { categoryId } = await params;

    if (!categoryId) {
      throw new ValidationError('Category ID is required');
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingCategory = await tx.galleryCategory.findUnique({
        where: { id: categoryId },
        select: { id: true, name: true, isFeatured: true },
      });

      if (!existingCategory) {
        throw new NotFoundError('Gallery category not found');
      }

      return tx.galleryCategory.update({
        where: { id: categoryId },
        data: { isFeatured: !existingCategory.isFeatured },
        select: { id: true, name: true, isFeatured: true },
      });
    });

    revalidatePublishedGallery();

    return NextResponse.json({
      message: `Gallery category "${result.name}" ${result.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        id: result.id,
        name: result.name,
        isFeatured: result.isFeatured,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
