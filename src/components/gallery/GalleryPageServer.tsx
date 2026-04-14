import GalleryPageClient from './GalleryPageClient';
import type {
  IGalleryCategory,
  IGalleryCategoriesPaginatedResponse,
} from '@/types/gallery/gallery-category.types';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

const CATEGORIES_PER_PAGE = 8;

async function fetchGalleryCategories(page: number): Promise<{
  categories: IGalleryCategory[];
  totalPages: number;
  total: number;
}> {
  try {
    const url = new URL('/api/gallery/categories/published', baseUrl);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', CATEGORIES_PER_PAGE.toString());
    url.searchParams.set('sortBy', 'name');
    url.searchParams.set('sortOrder', 'asc');
    url.searchParams.set('hasPhotos', 'true');

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch gallery categories');
      return { categories: [], totalPages: 1, total: 0 };
    }

    const data: IGalleryCategoriesPaginatedResponse = await response.json();

    return {
      categories: data.data,
      totalPages: data.meta.totalPages,
      total: data.meta.total,
    };
  } catch (err) {
    console.error('Error fetching gallery categories:', err);
    return { categories: [], totalPages: 1, total: 0 };
  }
}

interface GalleryPageServerProps {
  searchParams: { page?: string };
}

export default async function GalleryPageServer({
  searchParams,
}: GalleryPageServerProps) {
  const page = Math.max(1, parseInt(searchParams.page || '1'));

  const { categories, totalPages, total } = await fetchGalleryCategories(page);

  return (
    <GalleryPageClient
      categories={categories}
      currentPage={page}
      totalPages={totalPages}
      totalCount={total}
    />
  );
}
