// src/components/academy/AcademyGuidesServer.tsx
import { EducationalGuides } from './EducationalGuides';
import { IGuide, IGuidesPaginatedResponse } from '@/types/guides/guide.types';
import { GUIDES_CACHE_TAG, POSTS_REVALIDATE_SECONDS } from '@/config/cache';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const GUIDES_PER_PAGE = 6;

async function fetchGuides(page: number): Promise<IGuidesPaginatedResponse> {
  try {
    const url = new URL('/api/guides/published', baseUrl);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(GUIDES_PER_PAGE));

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [GUIDES_CACHE_TAG] },
    });

    if (!response.ok) {
      return {
        message: 'Error',
        data: [],
        meta: { total: 0, page: 1, limit: GUIDES_PER_PAGE, totalPages: 1 },
      };
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch guides:', error);
    return {
      message: 'Error',
      data: [],
      meta: { total: 0, page: 1, limit: GUIDES_PER_PAGE, totalPages: 1 },
    };
  }
}

export default async function AcademyGuidesServer({
  guidePage,
}: {
  guidePage: number;
}) {
  const response = await fetchGuides(guidePage);
  const guides: IGuide[] = response.data;

  return (
    <EducationalGuides
      guides={guides}
      currentPage={guidePage}
      totalPages={response.meta.totalPages ?? 1}
    />
  );
}
