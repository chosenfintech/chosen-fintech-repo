// src/app/api/posts/published/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPostById } from '@/utils/get-post-by-id';
import { handleApiError } from '@/middlewares/error-handler';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
): Promise<NextResponse> {
  try {
    const { postId } = await params;

    const post = await getPostById(postId, { isAuthenticated: false });

    return NextResponse.json(
      { message: 'Post retrieved successfully', data: post },
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
