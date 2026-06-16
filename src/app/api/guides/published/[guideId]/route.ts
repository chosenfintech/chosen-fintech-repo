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

    return NextResponse.json(
      { message: 'Guide retrieved successfully', data: guide },
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
