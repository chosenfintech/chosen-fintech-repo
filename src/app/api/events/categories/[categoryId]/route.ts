// src/app/api/events/categories/[categoryId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '@/middlewares/error-handler';
import type { Prisma } from '@/lib/prisma';
import type { IEventCategory } from '@/types/events/category.types';
import { updateEventCategorySchema } from '@/validations/events/category-validation';
import { revalidateEventCategories } from '@/utils/revalidate-events';

/**
 * PUT /api/categories/[categoryId]
 * Protected — update a category.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse> {
  try {
    await verifySession();
    const { categoryId } = await params;

    if (!categoryId) {
      throw new ValidationError('EventCategory ID is required');
    }

    const body = await req.json();

    const validation = updateEventCategorySchema.safeParse(body);
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
      const existingEventCategory = await tx.eventCategory.findUnique({
        where: { id: categoryId },
        select: { id: true, name: true },
      });

      if (!existingEventCategory) {
        throw new NotFoundError('EventCategory not found');
      }

      if (
        categoryDetails.name &&
        categoryDetails.name !== existingEventCategory.name
      ) {
        const duplicate = await tx.eventCategory.findUnique({
          where: { name: categoryDetails.name },
        });
        if (duplicate) {
          throw new ConflictError(
            `EventCategory with name "${categoryDetails.name}" already exists`,
          );
        }
      }

      const updateData: Prisma.EventCategoryUpdateInput = {};
      if (categoryDetails.name !== undefined) {
        updateData.name = categoryDetails.name;
      }

      return tx.eventCategory.update({
        where: { id: categoryId },
        data: updateData,
        include: {
          _count: { select: { events: true } },
        },
      });
    });

    const responseData: IEventCategory = {
      id: result.id,
      name: result.name,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      totalEventsCount: result._count.events,
    };

    revalidateEventCategories();

    return NextResponse.json({
      message: 'EventCategory updated successfully',
      data: responseData,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/categories/[categoryId]
 * Protected — deletes a category only if it has no associated events.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse> {
  try {
    await verifySession();
    const { categoryId } = await params;

    if (!categoryId) {
      throw new ValidationError('EventCategory ID is required');
    }

    const existingEventCategory = await prisma.eventCategory.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        _count: { select: { events: true } },
      },
    });

    if (!existingEventCategory) {
      throw new NotFoundError('EventCategory not found');
    }

    if (existingEventCategory._count.events > 0) {
      throw new BadRequestError(
        `Cannot delete category "${existingEventCategory.name}" because it has ${existingEventCategory._count.events} associated events. Please reassign or delete the events first.`,
      );
    }

    await prisma.eventCategory.delete({ where: { id: categoryId } });

    revalidateEventCategories();

    return NextResponse.json({
      message: `EventCategory "${existingEventCategory.name}" deleted successfully`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
