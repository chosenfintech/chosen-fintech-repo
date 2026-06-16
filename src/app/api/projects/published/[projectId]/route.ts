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

    return NextResponse.json(
      { message: 'Project retrieved successfully', data: project },
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
