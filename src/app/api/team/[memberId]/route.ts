// src/app/api/team/[memberId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma, { Prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin, requireStaff } from '@/utils/require-admin';
import { revalidatePublishedTeam } from '@/utils/revalidate-team';
import { cloudinaryService } from '@/config/claudinary';
import { mapTeamMemberToResponse } from '@/utils/team-member-utils';
import { updateTeamMemberSchema } from '@/validations/team/team-member-validation';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from '@/middlewares/error-handler';
import { getTeamMemberById } from '@/utils/get-team-member-by-id';

const TEAM_UPLOAD_FOLDER = 'chosen-fintech/team-photos';

/**
 * GET /api/team/[memberId]
 * Protected - returns any team member (published or not) for the edit form.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
): Promise<NextResponse> {
  try {
    const { memberId } = await params;

    await verifySession();

    const member = await getTeamMemberById(memberId, { isAuthenticated: true });

    return NextResponse.json(
      { message: 'Team member retrieved successfully', data: member },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/team/[memberId]
 * Protected - updates a team member. Accepts multipart/form-data; the photo is
 * replaced only when a new file is sent, and the old one is cleaned up after
 * the row is saved.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;

  try {
    const session = await verifySession();
    requireStaff(session);

    const { memberId } = await params;

    if (!memberId) {
      throw new ValidationError('Team member ID is required');
    }

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'image') continue;
      rawBody[key] = value;
    }

    const validation = updateTeamMemberSchema.safeParse(rawBody);

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

    const existingMember = await prisma.teamMember.findUnique({
      where: { id: memberId },
      select: { id: true, imageUrl: true },
    });

    if (!existingMember) {
      throw new NotFoundError('Team member not found');
    }

    const updateData: Prisma.TeamMemberUpdateInput = {};

    if (memberDetails.name !== undefined) updateData.name = memberDetails.name;
    if (memberDetails.role !== undefined) updateData.role = memberDetails.role;
    if (memberDetails.email !== undefined)
      updateData.email = memberDetails.email;
    if (memberDetails.facebookUrl !== undefined)
      updateData.facebookUrl = memberDetails.facebookUrl;
    if (memberDetails.twitterUrl !== undefined)
      updateData.twitterUrl = memberDetails.twitterUrl;
    if (memberDetails.linkedinUrl !== undefined)
      updateData.linkedinUrl = memberDetails.linkedinUrl;
    if (memberDetails.displayOrder !== undefined)
      updateData.displayOrder = memberDetails.displayOrder;
    if (memberDetails.isPublished !== undefined)
      updateData.isPublished = memberDetails.isPublished;

    const imageFile = formData.get('image');
    if (imageFile instanceof File && imageFile.size > 0) {
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
      updateData.imageUrl = uploadedImageUrl;
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: memberId },
      data: updateData,
    });

    // Only once the row points at the new photo is the old one safe to drop.
    if (uploadedImageUrl && existingMember.imageUrl !== uploadedImageUrl) {
      await cloudinaryService
        .deleteImage(existingMember.imageUrl)
        .catch((e) => console.warn('Failed to clean up old team photo:', e));
    }

    revalidatePublishedTeam();

    return NextResponse.json({
      message: 'Team member updated successfully',
      data: mapTeamMemberToResponse(updatedMember),
    });
  } catch (err) {
    if (uploadedImageUrl) {
      await cloudinaryService
        .deleteImage(uploadedImageUrl)
        .catch((e) => console.error('Cloudinary cleanup failed:', e));
    }
    return handleApiError(err);
  }
}

/**
 * DELETE /api/team/[memberId]
 * Protected (admin) - removes a team member and their photo from storage.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireAdmin(session);

    const { memberId } = await params;

    if (!memberId) {
      throw new ValidationError('Team member ID is required');
    }

    const existingMember = await prisma.teamMember.findUnique({
      where: { id: memberId },
      select: { id: true, imageUrl: true },
    });

    if (!existingMember) {
      throw new NotFoundError('Team member not found');
    }

    await prisma.teamMember.delete({ where: { id: memberId } });

    await cloudinaryService
      .deleteImage(existingMember.imageUrl)
      .catch((e) => console.warn('Failed to clean up team photo:', e));

    revalidatePublishedTeam();

    return NextResponse.json({
      message: 'Team member deleted successfully',
    });
  } catch (err) {
    return handleApiError(err);
  }
}
