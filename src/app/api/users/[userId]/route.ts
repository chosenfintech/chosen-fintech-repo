// src/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  BadRequestError,
} from '@/middlewares/error-handler';
import { updateUserSchema } from '@/validations/user-validation';
import type { Prisma } from '@/lib/prisma';
import type { IUser } from '@/types/user.types';

/**
 * GET /api/users/[userId]
 * Protected — admins can fetch any user, non-admins can only fetch themselves.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { userId } = await params;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!session.isAdmin && session.userId !== userId) {
      throw new ForbiddenError('You can only view your own profile');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return NextResponse.json({
      message: 'User retrieved successfully',
      data: user as IUser,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/users/[userId]
 * Protected — users can update their own profile (fullname, email, phone).
 * Only admins can additionally toggle isAdmin on other users.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { userId } = await params;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!session.isAdmin && session.userId !== userId) {
      throw new ForbiddenError('You can only update your own profile');
    }

    const body = await req.json();

    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const userDetails = validation.data;

    // Non-admins cannot touch isAdmin
    if (!session.isAdmin && userDetails.isAdmin !== undefined) {
      throw new ForbiddenError('Only admins can change admin status');
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Guard against email collision when email is being changed
    if (userDetails.email && userDetails.email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: userDetails.email },
        select: { id: true },
      });
      if (emailTaken) {
        throw new ConflictError(
          `A user with email "${userDetails.email}" already exists`,
        );
      }
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (userDetails.fullname !== undefined)
      updateData.fullname = userDetails.fullname;
    if (userDetails.email !== undefined) updateData.email = userDetails.email;
    if (userDetails.phone !== undefined) updateData.phone = userDetails.phone;
    if (session.isAdmin && userDetails.isAdmin !== undefined)
      updateData.isAdmin = userDetails.isAdmin;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: updatedUser as IUser,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/users/[userId]
 * Protected, admin only — cannot self-delete.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { userId } = await params;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!session.isAdmin) {
      throw new ForbiddenError('Only admins can delete users');
    }

    if (session.userId === userId) {
      throw new BadRequestError('You cannot delete your own account');
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullname: true, email: true },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({
      message: `User "${existingUser.fullname}" (${existingUser.email}) deleted successfully`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
