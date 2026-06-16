// src/app/api/events/[eventId]/toggle-publish/route.ts
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
import { revalidatePublishedEvents } from '@/utils/revalidate-events';

/**
 * PATCH /api/events/[eventId]/toggle-publish
 * Protected — toggles the published status of a event.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireStaff(session);
    const { eventId } = await params;

    if (!eventId) {
      throw new ValidationError('Valid event ID is required');
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEvent = await tx.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          title: true,
          isPublished: true,
          publishDate: true,
        },
      });

      if (!existingEvent) {
        throw new NotFoundError('Event not found');
      }

      const newPublishStatus = !parseBoolean(existingEvent.isPublished);

      return tx.event.update({
        where: { id: eventId },
        data: {
          isPublished: newPublishStatus,
          publishDate: newPublishStatus ? new Date() : existingEvent.publishDate,
        },
        select: {
          id: true,
          title: true,
          isPublished: true,
          publishDate: true,
        },
      });
    });

    revalidatePublishedEvents({ categories: true });

    return NextResponse.json({
      message: `Event "${result.title}" ${
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
