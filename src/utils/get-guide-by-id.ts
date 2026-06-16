// src/utils/get-guide-by-id.ts
import prisma from '@/lib/prisma';
import { NotFoundError, ValidationError } from '@/middlewares/error-handler';

interface GetGuideByIdOptions {
  isAuthenticated: boolean;
}

export async function getGuideById(
  guideId: string,
  { isAuthenticated }: GetGuideByIdOptions,
) {
  if (!guideId) {
    throw new ValidationError('Guide identifier is required');
  }

  const guide = await prisma.guide.findFirst({
    where: {
      OR: [{ id: guideId }, { slug: guideId }],
      ...(isAuthenticated ? {} : { isPublished: true }),
    },
    include: {
      author: { select: { id: true, fullname: true, email: true } },
    },
  });

  if (!guide) {
    throw new NotFoundError('Guide not found');
  }

  return guide;
}
