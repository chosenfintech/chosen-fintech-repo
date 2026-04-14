// src/utils/get-gallery-categories.ts
import prisma from '@/lib/prisma';
import { Prisma } from '@/lib/prisma';
import type { IGalleryCategory } from '@/types/gallery/gallery-category.types';

/**
 * Options for querying gallery categories.
 *
 * @property page - The current page number (1-based).
 * @property limit - Number of categories per page.
 * @property search - Optional name search string (case-insensitive).
 * @property sortBy - Field to sort by. Supports 'name', 'createdAt', 'updatedAt',
 *   'photoCount', 'publishedPhotoCount', and 'totalPhotoCount'.
 * @property sortOrder - Sort direction, either 'asc' or 'desc'.
 * @property hasPhotos - When true, restricts results to categories that have
 *   at least one published photo.
 * @property isPublic - Whether the request is from a public (unauthenticated)
 *   consumer. Reserved for future filtering logic (e.g. excluding draft-only
 *   categories from public responses).
 */
export interface GetGalleryCategoriesOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  hasPhotos?: boolean;
  isPublic: boolean;
}

/**
 * The shape returned by {@link getGalleryCategories}.
 *
 * @property categories - The mapped gallery category array for the current page.
 * @property total - Total number of categories matching the query (used for pagination).
 */
export interface GetGalleryCategoriesResult {
  categories: IGalleryCategory[];
  total: number;
}

/**
 * Fetches a paginated, filtered, and sorted list of gallery categories.
 *
 * Runs a `findMany` + `count` in parallel, then a single `groupBy` to derive
 * unpublished photo counts — avoiding N+1 queries. An in-memory sort is applied
 * when `sortBy` is `'totalPhotoCount'` since it is a derived value not available
 * to Prisma's `orderBy`.
 *
 * Note: `totalPhotoCount` sorting only covers the current page. Cross-page
 * ordering will be inconsistent for this sort key — consider a future server-side
 * solution if this becomes a requirement.
 *
 * @param options - See {@link GetGalleryCategoriesOptions}.
 * @returns A promise resolving to {@link GetGalleryCategoriesResult}.
 */
export async function getGalleryCategories({
  page,
  limit,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  hasPhotos = false,
}: GetGalleryCategoriesOptions): Promise<GetGalleryCategoriesResult> {
  const skip = (page - 1) * limit;

  const whereClause: Prisma.GalleryCategoryWhereInput = {};

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  if (hasPhotos) {
    whereClause.photos = { some: { isPublished: true } };
  }

  const orderBy: Prisma.GalleryCategoryOrderByWithRelationInput = {};
  if (sortBy === 'photoCount' || sortBy === 'publishedPhotoCount') {
    orderBy.photos = { _count: sortOrder };
  } else if (
    sortBy === 'name' ||
    sortBy === 'createdAt' ||
    sortBy === 'updatedAt'
  ) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [rawCategories, total] = await Promise.all([
    prisma.galleryCategory.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            photos: { where: { isPublished: true } },
          },
        },
      },
    }),
    prisma.galleryCategory.count({ where: whereClause }),
  ]);

  const unpublishedGroups = await prisma.galleryPhoto.groupBy({
    by: ['categoryId'],
    where: {
      categoryId: { in: rawCategories.map((c) => c.id) },
      isPublished: false,
    },
    _count: { id: true },
  });

  const unpublishedCountMap = new Map(
    unpublishedGroups.map((g) => [g.categoryId, g._count.id]),
  );

  const categories: IGalleryCategory[] = rawCategories.map((category) => {
    const unpublished = unpublishedCountMap.get(category.id) ?? 0;
    return {
      id: category.id,
      name: category.name,
      isFeatured: category.isFeatured,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      publishedPhotosCount: category._count.photos,
      unpublishedPhotosCount: unpublished,
      totalPhotosCount: category._count.photos + unpublished,
    };
  });

  if (sortBy === 'totalPhotoCount') {
    categories.sort((a, b) => {
      const diff = a.totalPhotosCount - b.totalPhotosCount;
      return sortOrder === 'asc' ? diff : -diff;
    });
  }

  return { categories, total };
}
