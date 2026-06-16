// src/app/api/projects/published/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProjectById } from '@/utils/get-project-by-id';
import { handleApiError } from '@/middlewares/error-handler';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<NextResponse> {
  try {
    const { projectId } = await params;

    const project = await getProjectById(projectId, { isAuthenticated: false });

    // Public endpoint: expose only id + fullname for the author (no email).
    const { author, ...rest } = project;
    const publicProject = {
      ...rest,
      author: { id: author.id, fullname: author.fullname },
    };

    return NextResponse.json(
      { message: 'Project retrieved successfully', data: publicProject },
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
