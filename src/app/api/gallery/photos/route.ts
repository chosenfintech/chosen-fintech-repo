// src/app/api/gallery/photos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cloudinaryService } from '@/config/claudinary';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  buildGalleryPhotoWhereClause,
  fetchGalleryPhotosWithPagination,
  mapGalleryPhotosToResponse,
  mapGalleryPhotoToResponse,
  GALLERY_PHOTO_INCLUDE,
} from '@/utils/gallery-photo-utils';
import { createGalleryPhotoSchema } from '@/validations/gallery/gallery-photo-validation';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import type {
  IGalleryPhotosPaginatedResponse,
  IGalleryPhotosQueryParams,
} from '@/types/gallery/gallery-photo.types';

const GALLERY_UPLOAD_FOLDER = 'chosen-fintech/gallery-images';

/**
 * GET /api/gallery/photos
 * Protected — returns all gallery photos with pagination and filters (admin use).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IGalleryPhotosQueryParams = {
      categoryId: searchParams.get('categoryId') ?? undefined,
      isPublished:
        parseBoolean(searchParams.get('isPublished'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildGalleryPhotoWhereClause(queryParams);

    const { photos, total } = await fetchGalleryPhotosWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IGalleryPhotosPaginatedResponse = {
      message: 'Gallery photos retrieved successfully',
      data: mapGalleryPhotosToResponse(photos),
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
 * POST /api/gallery/photos
 * Protected — uploads a new gallery photo. Accepts multipart/form-data.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;

  try {
    await verifySession();

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'image') continue;
      rawBody[key] = value;
    }

    const validation = createGalleryPhotoSchema.safeParse(rawBody);

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

    const imageFile = formData.get('image');
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      throw new ValidationError('A valid image file is required');
    }

    const category = await prisma.galleryCategory.findUnique({
      where: { id: photoDetails.categoryId },
    });

    if (!category) {
      throw new NotFoundError(
        `Gallery category with ID ${photoDetails.categoryId} not found`,
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const result = await cloudinaryService.uploadImage(
      {
        buffer,
        originalname: imageFile.name,
        mimetype: imageFile.type,
      },
      { folder: GALLERY_UPLOAD_FOLDER },
    );

    uploadedImageUrl = result.secure_url;

    const photo = await prisma.galleryPhoto.create({
      data: {
        url: uploadedImageUrl,
        altText: photoDetails.altText ?? null,
        caption: photoDetails.caption ?? null,
        isPublished: photoDetails.isPublished ?? false,
        categoryId: photoDetails.categoryId,
      },
      include: GALLERY_PHOTO_INCLUDE,
    });

    return NextResponse.json(
      {
        message: 'Gallery photo uploaded successfully',
        data: mapGalleryPhotoToResponse(photo),
      },
      { status: 201 },
    );
  } catch (err) {
    if (uploadedImageUrl) {
      await cloudinaryService
        .deleteImage(uploadedImageUrl)
        .catch((e) => console.error('Cloudinary cleanup failed:', e));
    }
    return handleApiError(err);
  }
}
