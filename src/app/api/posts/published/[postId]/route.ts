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

    // Public endpoint: expose only id + fullname for the author (no email).
    const { author, ...rest } = post;
    const publicPost = {
      ...rest,
      author: { id: author.id, fullname: author.fullname },
    };

    return NextResponse.json(
      { message: 'Post retrieved successfully', data: publicPost },
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
