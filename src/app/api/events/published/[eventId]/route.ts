// src/app/api/events/published/[eventId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEventById } from '@/utils/get-event-by-id';
import { handleApiError } from '@/middlewares/error-handler';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
): Promise<NextResponse> {
  try {
    const { eventId } = await params;

    const event = await getEventById(eventId, { isAuthenticated: false });

    return NextResponse.json(
      { message: 'Event retrieved successfully', data: event },
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
