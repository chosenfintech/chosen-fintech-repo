// src/app/api/team/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireStaff } from '@/utils/require-admin';
import { revalidatePublishedTeam } from '@/utils/revalidate-team';
import { cloudinaryService } from '@/config/claudinary';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  buildTeamMemberWhereClause,
  fetchTeamMembersWithPagination,
  mapTeamMembersToResponse,
  mapTeamMemberToResponse,
} from '@/utils/team-member-utils';
import { createTeamMemberSchema } from '@/validations/team/team-member-validation';
import { handleApiError, ValidationError } from '@/middlewares/error-handler';
import type {
  ITeamMembersPaginatedResponse,
  ITeamMembersQueryParams,
} from '@/types/team/team-member.types';

const TEAM_UPLOAD_FOLDER = 'chosen-fintech/team-photos';

/**
 * GET /api/team
 * Protected - every team member (published or not) with pagination and filters.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: ITeamMembersQueryParams = {
      isPublished:
        parseBoolean(searchParams.get('isPublished'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildTeamMemberWhereClause(queryParams);

    const { members, total } = await fetchTeamMembersWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: ITeamMembersPaginatedResponse = {
      message: 'Team members retrieved successfully',
      data: mapTeamMembersToResponse(members),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(paginatedResponse);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/team
 * Protected - adds a team member. Accepts multipart/form-data (photo + fields).
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;

  try {
    const session = await verifySession();
    requireStaff(session);

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'image') continue;
      rawBody[key] = value;
    }

    const validation = createTeamMemberSchema.safeParse(rawBody);

    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const memberDetails = validation.data;

    const imageFile = formData.get('image');
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      throw new ValidationError('A photo of the team member is required');
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const result = await cloudinaryService.uploadImage(
      {
        buffer,
        originalname: imageFile.name,
        mimetype: imageFile.type,
      },
      { folder: TEAM_UPLOAD_FOLDER },
    );

    uploadedImageUrl = result.secure_url;

    const member = await prisma.teamMember.create({
      data: {
        name: memberDetails.name,
        role: memberDetails.role,
        imageUrl: uploadedImageUrl,
        email: memberDetails.email,
        facebookUrl: memberDetails.facebookUrl,
        twitterUrl: memberDetails.twitterUrl,
        linkedinUrl: memberDetails.linkedinUrl,
        displayOrder: memberDetails.displayOrder,
        isPublished: memberDetails.isPublished,
      },
    });

    revalidatePublishedTeam();

    return NextResponse.json(
      {
        message: 'Team member added successfully',
        data: mapTeamMemberToResponse(member),
      },
      { status: 201 },
    );
  } catch (err) {
    if (uploadedImageUrl) {
      await cloudinaryService
        .deleteImage(uploadedImageUrl)
        .catch((e) => console.error('Cloudinary cleanup failed:', e));
    }
    return handleApiError(err);
  }
}
