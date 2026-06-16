// src/app/api/posts/categories/[categoryId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin, requireStaff } from '@/utils/require-admin';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '@/middlewares/error-handler';
import type { Prisma } from '@/lib/prisma';
import type { ICategory } from '@/types/posts/category.types';
import { updateCategorySchema } from '@/validations/posts/category-validation';
import { revalidatePostCategories } from '@/utils/revalidate-posts';

/**
 * PUT /api/categories/[categoryId]
 * Protected — update a category.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireStaff(session);
    const { categoryId } = await params;

    if (!categoryId) {
      throw new ValidationError('Category ID is required');
    }

    const body = await req.json();

    const validation = updateCategorySchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const categoryDetails = validation.data;

    const result = await prisma.$transaction(async (tx) => {
      const existingCategory = await tx.category.findUnique({
        where: { id: categoryId },
        select: { id: true, name: true },
      });

      if (!existingCategory) {
        throw new NotFoundError('Category not found');
      }

      if (
        categoryDetails.name &&
        categoryDetails.name !== existingCategory.name
      ) {
        const duplicate = await tx.category.findUnique({
          where: { name: categoryDetails.name },
        });
        if (duplicate) {
          throw new ConflictError(
            `Category with name "${categoryDetails.name}" already exists`,
          );
        }
      }

      const updateData: Prisma.CategoryUpdateInput = {};
      if (categoryDetails.name !== undefined) {
        updateData.name = categoryDetails.name;
      }

      return tx.category.update({
        where: { id: categoryId },
        data: updateData,
        include: {
          _count: { select: { posts: true } },
        },
      });
    });

    const responseData: ICategory = {
      id: result.id,
      name: result.name,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      totalPostsCount: result._count.posts,
    };

    revalidatePostCategories();

    return NextResponse.json({
      message: 'Category updated successfully',
      data: responseData,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/categories/[categoryId]
 * Protected — deletes a category only if it has no associated posts.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    requireAdmin(session);
    const { categoryId } = await params;

    if (!categoryId) {
      throw new ValidationError('Category ID is required');
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        _count: { select: { posts: true } },
      },
    });

    if (!existingCategory) {
      throw new NotFoundError('Category not found');
    }

    if (existingCategory._count.posts > 0) {
      throw new BadRequestError(
        `Cannot delete category "${existingCategory.name}" because it has ${existingCategory._count.posts} associated posts. Please reassign or delete the posts first.`,
      );
    }

    await prisma.category.delete({ where: { id: categoryId } });

    revalidatePostCategories();

    return NextResponse.json({
      message: `Category "${existingCategory.name}" deleted successfully`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
