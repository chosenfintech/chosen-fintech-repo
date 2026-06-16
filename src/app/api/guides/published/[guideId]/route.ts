// src/app/api/guides/published/[guideId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGuideById } from '@/utils/get-guide-by-id';
import { handleApiError } from '@/middlewares/error-handler';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ guideId: string }> },
): Promise<NextResponse> {
  try {
    const { guideId } = await params;

    const guide = await getGuideById(guideId, { isAuthenticated: false });

    // Public endpoint: expose only id + fullname for the author (no email).
    const { author, ...rest } = guide;
    const publicGuide = {
      ...rest,
      author: { id: author.id, fullname: author.fullname },
    };

    return NextResponse.json(
      { message: 'Guide retrieved successfully', data: publicGuide },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300',
        },
      },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
