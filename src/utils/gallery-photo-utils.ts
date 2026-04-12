// src/utils/gallery-photo-utils.ts
import prisma, { Prisma } from '@/lib/prisma';
import type {
  IGalleryPhoto,
  IGalleryPhotosQueryParams,
} from '@/types/gallery/gallery-photo.types';

export interface GetGalleryPhotosOptions {
  forcePublished?: boolean;
}

const GALLERY_PHOTO_INCLUDE = {
  category: {
    select: {
      id: true,
      name: true,
      isFeatured: true,
    },
  },
} satisfies Prisma.GalleryPhotoInclude;

type GalleryPhotoWithRelations = Prisma.GalleryPhotoGetPayload<{
  include: typeof GALLERY_PHOTO_INCLUDE;
}>;

export { GALLERY_PHOTO_INCLUDE };
export type { GalleryPhotoWithRelations };

export const buildGalleryPhotoWhereClause = (
  params: IGalleryPhotosQueryParams,
  options: GetGalleryPhotosOptions = {},
): Prisma.GalleryPhotoWhereInput => {
  const { categoryId, isPublished, search } = params;
  const { forcePublished } = options;

  const whereClause: Prisma.GalleryPhotoWhereInput = {};

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  if (forcePublished) {
    whereClause.isPublished = true;
  } else if (isPublished === true) {
    whereClause.isPublished = true;
  } else if (isPublished === false) {
    whereClause.isPublished = false;
  }

  if (search) {
    whereClause.OR = [
      { altText: { contains: search, mode: 'insensitive' } },
      { caption: { contains: search, mode: 'insensitive' } },
    ];
  }

  return whereClause;
};

export const fetchGalleryPhotosWithPagination = async (
  whereClause: Prisma.GalleryPhotoWhereInput,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [photos, total] = await Promise.all([
    prisma.galleryPhoto.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: GALLERY_PHOTO_INCLUDE,
    }),
    prisma.galleryPhoto.count({ where: whereClause }),
  ]);

  return { photos, total };
};

export const mapGalleryPhotosToResponse = (
  photos: GalleryPhotoWithRelations[],
): IGalleryPhoto[] => {
  return photos.map((photo) => ({
    id: photo.id,
    url: photo.url,
    altText: photo.altText,
    caption: photo.caption,
    isPublished: photo.isPublished,
    categoryId: photo.categoryId,
    category: {
      id: photo.category.id,
      name: photo.category.name,
      isFeatured: photo.category.isFeatured,
    },
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt,
  }));
};

export const mapGalleryPhotoToResponse = (
  photo: GalleryPhotoWithRelations,
): IGalleryPhoto => mapGalleryPhotosToResponse([photo])[0];
