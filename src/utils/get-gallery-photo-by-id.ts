// src/utils/get-gallery-photo-by-id.ts
import prisma from '@/lib/prisma';
import {
  GALLERY_PHOTO_INCLUDE,
  mapGalleryPhotoToResponse,
} from '@/utils/gallery-photo-utils';
import { ValidationError, NotFoundError } from '@/middlewares/error-handler';

interface GetGalleryPhotoByIdOptions {
  isAuthenticated: boolean;
}

export async function getGalleryPhotoById(
  photoId: string,
  { isAuthenticated }: GetGalleryPhotoByIdOptions,
) {
  if (!photoId) {
    throw new ValidationError('Photo ID is required');
  }

  const photo = await prisma.galleryPhoto.findUnique({
    where: {
      id: photoId,
      ...(isAuthenticated ? {} : { isPublished: true }),
    },
    include: GALLERY_PHOTO_INCLUDE,
  });

  if (!photo) {
    throw new NotFoundError('Gallery photo not found');
  }

  return mapGalleryPhotoToResponse(photo);
}
