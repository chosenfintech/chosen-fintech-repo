// src/app/api/users/[userId]/role/route.ts
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
import { changeUserRoleSchema } from '@/validations/user-validation';
import type { IUser } from '@/types/user.types';

/**
 * PATCH /api/users/[userId]/role
 * Protected, admin only — change another user's role (ADMIN | EDITOR).
 * Admins cannot change their own role (prevents self-lockout/escalation).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { userId } = await params;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!session.isAdmin) {
      throw new ForbiddenError('Only admins can change user roles');
    }

    if (session.userId === userId) {
      throw new BadRequestError('You cannot change your own role');
    }

    const body = await req.json();
    const validation = changeUserRoleSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const { role } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    if (existingUser.role === role) {
      throw new ConflictError(`User already has the role: ${role}`);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: `User role updated successfully to ${role}`,
      data: updatedUser as IUser,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
