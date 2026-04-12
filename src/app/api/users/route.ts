// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  ForbiddenError,
  ConflictError,
} from '@/middlewares/error-handler';
import { createUserSchema } from '@/validations/user-validation';
import type { IUser, IUsersPaginatedResponse } from '@/types/user.types';
import type { Prisma } from '@/lib/prisma';

const BCRYPT_SALT_ROUNDS = 10;

/**
 * GET /api/users
 * Protected, admin only — returns paginated users with optional search.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await verifySession();

    if (!session.isAdmin) {
      throw new ForbiddenError('Only super admins can view all admins');
    }

    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') ?? undefined;

    const whereClause: Prisma.UserWhereInput = {};

    if (search) {
      whereClause.OR = [
        { fullname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { fullname: 'asc' },
        select: {
          id: true,
          fullname: true,
          email: true,
          phone: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    const paginatedResponse: IUsersPaginatedResponse = {
      message: 'Users retrieved successfully',
      data: users as IUser[],
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
 * POST /api/users
 * Protected, admin only — creates a new user.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await verifySession();

    if (!session.isAdmin) {
      throw new ForbiddenError('Only super admins can create new admins');
    }

    const body = await req.json();

    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const { fullname, email, password, phone } = validation.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError(`An admin with email "${email}" already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        phone: phone ?? null,
      },
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

    return NextResponse.json(
      { message: 'Admin created successfully', data: user as IUser },
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
