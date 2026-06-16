// src/app/api/gallery/categories/[categoryId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin, requireStaff } from '@/utils/require-admin';
import { revalidatePublishedGallery } from '@/utils/revalidate-gallery';
import { cloudinaryService } from '@/config/claudinary';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
  ConflictError,
} from '@/middlewares/error-handler';
import type { IGalleryCategory } from '@/types/gallery/gallery-category.types';
import { updateGalleryCategorySchema } from '@/validations/gallery/gallery-category-validation';

/**
 * Builds a full IGalleryCategory response object with photo counts
 * for a single category, using two targeted queries to avoid N+1.
 */
async function buildCategoryResponse(
  categoryId: string,
): Promise<IGalleryCategory | null> {
  const category = await prisma.galleryCategory.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: {
          photos: { where: { isPublished: true } },
        },
      },
    },
  });

  if (!category) return null;

  const unpublishedCount = await prisma.galleryPhoto.count({
    where: { categoryId, isPublished: false },
  });

  return {
    id: category.id,
    name: category.name,
    isFeatured: category.isFeatured,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    publishedPhotosCount: category._count.photos,
    unpublishedPhotosCount: unpublishedCount,
    totalPhotosCount: category._count.photos + unpublishedCount,
  };
}
/**
 * PUT /api/gallery/categories/[categoryId]
 * Protected — updates name and/or isFeatured of a gallery category.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireStaff(session);

    const { categoryId } = await params;

    if (!categoryId) {
      throw new ValidationError('Category ID is required');
    }

    const body = await req.json();

    const validation = updateGalleryCategorySchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const categoryDetails = validation.data;

    const existingCategory = await prisma.galleryCategory.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true },
    });

    if (!existingCategory) {
      throw new NotFoundError('Gallery category not found');
    }

    // Guard against name collision only when the name is actually changing
    if (
      categoryDetails.name !== undefined &&
      categoryDetails.name !== existingCategory.name
    ) {
      const nameConflict = await prisma.galleryCategory.findUnique({
        where: { name: categoryDetails.name },
        select: { id: true },
      });

      if (nameConflict) {
        throw new ConflictError(
          `Gallery category with name "${categoryDetails.name}" already exists`,
        );
      }
    }

    await prisma.galleryCategory.update({
      where: { id: categoryId },
      data: {
        ...(categoryDetails.name !== undefined && {
          name: categoryDetails.name,
        }),
        ...(categoryDetails.isFeatured !== undefined && {
          isFeatured: categoryDetails.isFeatured,
        }),
      },
    });

    const updatedCategory = await buildCategoryResponse(categoryId);

    revalidatePublishedGallery();

    return NextResponse.json({
      message: 'Gallery category updated successfully',
      data: updatedCategory,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/gallery/categories/[categoryId]
 * Protected — deletes the category and bulk-removes all its photos from Cloudinary.
 * DB photos are removed via cascade. Cloudinary cleanup is best-effort.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireAdmin(session);

    const { categoryId } = await params;

    if (!categoryId) {
      throw new ValidationError('Category ID is required');
    }

    const existingCategory = await prisma.galleryCategory.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        photos: { select: { url: true } },
      },
    });

    if (!existingCategory) {
      throw new NotFoundError('Gallery category not found');
    }

    // Delete the category — cascade removes all associated GalleryPhoto rows
    await prisma.galleryCategory.delete({ where: { id: categoryId } });

    // Best-effort Cloudinary cleanup for all photos in this category
    if (existingCategory.photos.length > 0) {
      await Promise.allSettled(
        existingCategory.photos.map((photo) =>
          cloudinaryService.deleteImage(photo.url),
        ),
      ).then((results) => {
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(
              `Failed to delete Cloudinary image for photo at index ${index}:`,
              result.reason,
            );
          }
        });
      });
    }

    revalidatePublishedGallery();

    return NextResponse.json({
      message: `Gallery category "${existingCategory.name}" and its ${existingCategory.photos.length} photo(s) deleted successfully`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
