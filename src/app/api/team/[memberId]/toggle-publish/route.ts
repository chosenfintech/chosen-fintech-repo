// src/app/api/team/[memberId]/toggle-publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireStaff } from '@/utils/require-admin';
import { revalidatePublishedTeam } from '@/utils/revalidate-team';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';

/**
 * PATCH /api/team/[memberId]/toggle-publish
 * Protected - shows or hides a team member on the public About page.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireStaff(session);

    const { memberId } = await params;

    if (!memberId) {
      throw new ValidationError('Team member ID is required');
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingMember = await tx.teamMember.findUnique({
        where: { id: memberId },
        select: { id: true, isPublished: true },
      });

      if (!existingMember) {
        throw new NotFoundError('Team member not found');
      }

      return tx.teamMember.update({
        where: { id: memberId },
        data: { isPublished: !existingMember.isPublished },
        select: { id: true, isPublished: true },
      });
    });

    revalidatePublishedTeam();

    return NextResponse.json({
      message: `Team member ${result.isPublished ? 'published' : 'hidden'} successfully`,
      data: {
        id: result.id,
        isPublished: result.isPublished,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
