// src/utils/team-member-utils.ts
import prisma, { Prisma } from '@/lib/prisma';
import type {
  ITeamMember,
  ITeamMembersQueryParams,
} from '@/types/team/team-member.types';

export interface GetTeamMembersOptions {
  forcePublished?: boolean;
}

type TeamMemberRecord = Prisma.TeamMemberGetPayload<object>;

export const buildTeamMemberWhereClause = (
  params: ITeamMembersQueryParams,
  options: GetTeamMembersOptions = {},
): Prisma.TeamMemberWhereInput => {
  const { isPublished, search } = params;
  const { forcePublished } = options;

  const whereClause: Prisma.TeamMemberWhereInput = {};

  if (forcePublished) {
    whereClause.isPublished = true;
  } else if (isPublished !== undefined) {
    whereClause.isPublished = isPublished;
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { role: { contains: search, mode: 'insensitive' } },
    ];
  }

  return whereClause;
};

/**
 * Ordered by `displayOrder` first so the About page renders leadership in the
 * order an admin chose; `createdAt` breaks ties deterministically.
 */
export const fetchTeamMembersWithPagination = async (
  whereClause: Prisma.TeamMemberWhereInput,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [members, total] = await Promise.all([
    prisma.teamMember.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.teamMember.count({ where: whereClause }),
  ]);

  return { members, total };
};

export const mapTeamMembersToResponse = (
  members: TeamMemberRecord[],
): ITeamMember[] =>
  members.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    imageUrl: member.imageUrl,
    email: member.email,
    facebookUrl: member.facebookUrl,
    twitterUrl: member.twitterUrl,
    linkedinUrl: member.linkedinUrl,
    displayOrder: member.displayOrder,
    isPublished: member.isPublished,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  }));

export const mapTeamMemberToResponse = (
  member: TeamMemberRecord,
): ITeamMember => mapTeamMembersToResponse([member])[0];
