// src/utils/get-project-by-id.ts
import prisma from '@/lib/prisma';
import { NotFoundError, ValidationError } from '@/middlewares/error-handler';

interface GetProjectByIdOptions {
  isAuthenticated: boolean;
}

export async function getProjectById(
  projectId: string,
  { isAuthenticated }: GetProjectByIdOptions,
) {
  if (!projectId) {
    throw new ValidationError('Project identifier is required');
  }

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id: projectId }, { slug: projectId }],
      ...(isAuthenticated ? {} : { isPublished: true }),
    },
    include: {
      author: { select: { id: true, fullname: true, email: true } },
    },
  });

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  return project;
}
