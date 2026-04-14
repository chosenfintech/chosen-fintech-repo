// src/app/api/gallery/photos/published/[photoId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGalleryPhotoById } from '@/utils/get-gallery-photo-by-id';
import { handleApiError } from '@/middlewares/error-handler';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> },
): Promise<NextResponse> {
  try {
    const { photoId } = await params;

    const photo = await getGalleryPhotoById(photoId, { isAuthenticated: false });

    return NextResponse.json(
      { message: 'Gallery photo retrieved successfully', data: photo },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (err) {
    return handleApiError(err);
  }
}