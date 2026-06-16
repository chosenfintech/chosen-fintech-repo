// src/app/api/projects/[projectId]/toggle-publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireStaff } from '@/utils/require-admin';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { revalidatePublishedProjects } from '@/utils/revalidate-projects';

/**
 * PATCH /api/projects/[projectId]/toggle-publish
 * Protected — toggles the published status of a project.
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

    const result = await prisma.$transaction(async (tx) => {
      const existingProject = await tx.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          title: true,
          isPublished: true,
          publishDate: true,
        },
      });

      if (!existingProject) {
        throw new NotFoundError('Project not found');
      }

      const newPublishStatus = !parseBoolean(existingProject.isPublished);

      return tx.project.update({
        where: { id: projectId },
        data: {
          isPublished: newPublishStatus,
          publishDate: newPublishStatus ? new Date() : existingProject.publishDate,
        },
        select: {
          id: true,
          title: true,
          isPublished: true,
          publishDate: true,
        },
      });
    });

    revalidatePublishedProjects();

    return NextResponse.json({
      message: `Project "${result.title}" ${
        result.isPublished ? 'published' : 'unpublished'
      } successfully`,
      data: {
        id: result.id,
        title: result.title,
        isPublished: result.isPublished,
        publishDate: result.publishDate,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
