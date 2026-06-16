// src/app/api/events/[eventId]/toggle-featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { revalidatePublishedEvents } from '@/utils/revalidate-events';

/**
 * PATCH /api/events/[eventId]/toggle-featured
 * Protected — toggles the featured status of a event.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
): Promise<NextResponse> {
  try {
    await verifySession();
    const { eventId } = await params;

    if (!eventId) {
      throw new ValidationError('Valid event ID is required');
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        isFeatured: true,
      },
    });

    if (!existingEvent) {
      throw new NotFoundError('Event not found');
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { isFeatured: !existingEvent.isFeatured },
      select: {
        id: true,
        title: true,
        isFeatured: true,
      },
    });

    revalidatePublishedEvents();

    return NextResponse.json({
      message: `Event "${updatedEvent.title}" ${
        updatedEvent.isFeatured ? 'featured' : 'unfeatured'
      } successfully`,
      data: {
        id: updatedEvent.id,
        title: updatedEvent.title,
        isFeatured: updatedEvent.isFeatured,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
