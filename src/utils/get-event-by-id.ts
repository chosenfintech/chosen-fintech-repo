// src/utils/get-event-by-id.ts
import prisma from '@/lib/prisma';
import { NotFoundError, ValidationError } from '@/middlewares/error-handler';

interface GetEventByIdOptions {
  isAuthenticated: boolean;
}

export async function getEventById(
  eventId: string,
  { isAuthenticated }: GetEventByIdOptions,
) {
  if (!eventId) {
    throw new ValidationError('Event identifier is required');
  }

  const event = await prisma.event.findFirst({
    where: {
      OR: [{ id: eventId }, { slug: eventId }],
      ...(isAuthenticated ? {} : { isPublished: true }),
    },
    include: {
      author: { select: { id: true, fullname: true, email: true } },
      category: { select: { id: true, name: true } },
    },
  });

  if (!event) {
    throw new NotFoundError('Event not found');
  }

  return event;
}
