// src/utils/get-team-member-by-id.ts
import prisma from '@/lib/prisma';
import { mapTeamMemberToResponse } from '@/utils/team-member-utils';
import { ValidationError, NotFoundError } from '@/middlewares/error-handler';

interface GetTeamMemberByIdOptions {
  isAuthenticated: boolean;
}

export async function getTeamMemberById(
  memberId: string,
  { isAuthenticated }: GetTeamMemberByIdOptions,
) {
  if (!memberId) {
    throw new ValidationError('Team member ID is required');
  }

  const member = await prisma.teamMember.findUnique({
    where: {
      id: memberId,
      ...(isAuthenticated ? {} : { isPublished: true }),
    },
  });

  if (!member) {
    throw new NotFoundError('Team member not found');
  }

  return mapTeamMemberToResponse(member);
}
