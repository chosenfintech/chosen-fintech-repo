// src/app/api/projects/[projectId]/toggle-featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireStaff } from '@/utils/require-admin';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { revalidatePublishedProjects } from '@/utils/revalidate-projects';

/**
 * PATCH /api/projects/[projectId]/toggle-featured
 * Protected — toggles the featured status of a project.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireStaff(session);
    const { projectId } = await params;

    if (!projectId) {
      throw new ValidationError('Valid project ID is required');
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        isFeatured: true,
      },
    });

    if (!existingProject) {
      throw new NotFoundError('Project not found');
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { isFeatured: !existingProject.isFeatured },
      select: {
        id: true,
        title: true,
        isFeatured: true,
      },
    });

    revalidatePublishedProjects();

    return NextResponse.json({
      message: `Project "${updatedProject.title}" ${
        updatedProject.isFeatured ? 'featured' : 'unfeatured'
      } successfully`,
      data: {
        id: updatedProject.id,
        title: updatedProject.title,
        isFeatured: updatedProject.isFeatured,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
