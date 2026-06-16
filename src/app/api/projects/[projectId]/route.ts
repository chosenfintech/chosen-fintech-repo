// src/app/api/projects/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin } from '@/utils/require-admin';
import { cloudinaryService } from '@/config/claudinary';
import { generateSlug } from '@/utils/generate-slug';
import { calculateReadTime } from '@/utils/read-time-calculator';
import { parseBoolean } from '@/utils/parse-booleans';
import type { Prisma } from '@/lib/prisma';
import {
  handleApiError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/middlewares/error-handler';
import { updateProjectSchema } from '@/validations/projects/project-validation';
import { getProjectById } from '@/utils/get-project-by-id';
import {
  uploadBase64ContentImages,
  deleteOrphanedContentImages,
  deleteUploadedContentImages,
} from '@/utils/content-images';
import { revalidatePublishedProjects } from '@/utils/revalidate-projects';

const PROJECTS_UPLOAD_FOLDER = 'chosen-fintech/projects-images';

/**
 * GET /api/projects/[projectId]
 * Protected — returns any project (published or draft).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<NextResponse> {
  try {
    const { projectId } = await params;
    await verifySession();

    const project = await getProjectById(projectId, { isAuthenticated: true });

    return NextResponse.json(
      { message: 'Project retrieved successfully', data: project },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/projects/[projectId]
 * Protected — update an existing project. Accepts multipart/form-data.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;
  let uploadedContentPublicIds: string[] = [];

  try {
    const session = await verifySession();
    requireAdmin(session);
    const { projectId } = await params;

    if (!projectId) {
      throw new ValidationError('Project ID is required');
    }

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'imageUrl') continue;
      rawBody[key] = value;
    }

    const validation = updateProjectSchema.safeParse(rawBody);
    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const projectDetails = validation.data;

    let imageExplicitlySet = false;
    let imageNull = false;

    const imageEntry = formData.get('imageUrl');
    if (imageEntry !== null) {
      imageExplicitlySet = true;
      if (
        typeof imageEntry === 'string' &&
        (imageEntry === 'null' ||
          imageEntry === 'undefined' ||
          imageEntry === '')
      ) {
        imageNull = true;
      } else if (imageEntry instanceof File && imageEntry.size > 0) {
        const buffer = Buffer.from(await imageEntry.arrayBuffer());
        const result = await cloudinaryService.uploadImage(
          {
            buffer,
            originalname: imageEntry.name,
            mimetype: imageEntry.type,
          },
          { folder: PROJECTS_UPLOAD_FOLDER },
        );
        uploadedImageUrl = result.secure_url;
      }
    }

    let processedContent: string | undefined;
    if (projectDetails.content !== undefined) {
      const contentResult = await uploadBase64ContentImages(
        projectDetails.content,
      );
      processedContent = contentResult.html;
      uploadedContentPublicIds = contentResult.uploadedPublicIds;
    }

    let oldImage: string | null = null;
    let oldContent: string | null = null;
    let shouldDeleteOldImage = false;

    const result = await prisma.$transaction(async (tx) => {
      const existingProject = await tx.project.findUnique({
        where: { id: projectId },
        select: {
          authorId: true,
          imageUrl: true,
          content: true,
          isPublished: true,
          publishDate: true,
        },
      });

      if (!existingProject) {
        throw new NotFoundError('Project not found');
      }

      oldImage = existingProject.imageUrl;
      oldContent = existingProject.content;

      const updateData: Prisma.ProjectUpdateInput = {};

      if (projectDetails.title !== undefined) {
        updateData.title = projectDetails.title;
        updateData.slug = generateSlug(projectDetails.title);
      }
      if (projectDetails.description !== undefined)
        updateData.description = projectDetails.description;
      if (projectDetails.content !== undefined) {
        updateData.content = processedContent;
        updateData.readTime = calculateReadTime(processedContent!);
      }

      if (projectDetails.isPublished !== undefined) {
        const isPublished = parseBoolean(projectDetails.isPublished);
        updateData.isPublished = isPublished;
        updateData.publishDate = isPublished
          ? projectDetails.publishDate !== undefined
            ? new Date(projectDetails.publishDate!)
            : (existingProject.publishDate ?? new Date())
          : null;
      } else if (projectDetails.publishDate !== undefined) {
        updateData.publishDate = projectDetails.publishDate
          ? new Date(projectDetails.publishDate)
          : null;
      }

      if (projectDetails.isFeatured !== undefined) {
        updateData.isFeatured = parseBoolean(projectDetails.isFeatured);
      }

      if (imageExplicitlySet) {
        if (imageNull) {
          updateData.imageUrl = null;
          shouldDeleteOldImage = oldImage !== null;
        } else if (uploadedImageUrl) {
          updateData.imageUrl = uploadedImageUrl;
          shouldDeleteOldImage =
            oldImage !== null && oldImage !== uploadedImageUrl;
        }
      }

      if (projectDetails.createdAt !== undefined)
        updateData.createdAt = new Date(projectDetails.createdAt);
      if (projectDetails.updatedAt !== undefined)
        updateData.updatedAt = new Date(projectDetails.updatedAt);

      return tx.project.update({
        where: { id: projectId },
        data: updateData,
        include: {
          author: { select: { id: true, fullname: true, email: true } },
        },
      });
    });

    await Promise.all([
      shouldDeleteOldImage && oldImage
        ? cloudinaryService
            .deleteImage(oldImage)
            .catch((e) => console.warn('Failed to clean up old image:', e))
        : Promise.resolve(),
      oldContent && processedContent !== undefined
        ? deleteOrphanedContentImages(oldContent, processedContent)
        : Promise.resolve(),
    ]);

    revalidatePublishedProjects();

    return NextResponse.json({
      message: 'Project updated successfully',
      data: {
        id: result.id,
        slug: result.slug,
        title: result.title,
        description: result.description,
        content: result.content,
        readTime: result.readTime,
        imageUrl: result.imageUrl,
        isPublished: result.isPublished,
        isFeatured: result.isFeatured,
        publishDate: result.publishDate,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
      },
    });
  } catch (err) {
    await Promise.all([
      uploadedImageUrl
        ? cloudinaryService
            .deleteImage(uploadedImageUrl)
            .catch((e) => console.error('Cloudinary cleanup failed:', e))
        : Promise.resolve(),
      deleteUploadedContentImages(uploadedContentPublicIds),
    ]);
    return handleApiError(err);
  }
}

/**
 * DELETE /api/projects/[projectId]
 * Protected — authors can only delete their own projects.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<NextResponse> {
  try {
    const session = await verifySession();
    const { projectId } = await params;

    if (!projectId) {
      throw new ValidationError('Project ID is required');
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        authorId: true,
        imageUrl: true,
        author: { select: { fullname: true } },
      },
    });

    if (!existingProject) {
      throw new NotFoundError('Project not found');
    }

    if (!session.isAdmin && existingProject.authorId !== session.userId) {
      throw new ForbiddenError('You can only delete your own projects');
    }

    await prisma.project.delete({ where: { id: projectId } });

    if (existingProject.imageUrl) {
      await cloudinaryService
        .deleteImage(existingProject.imageUrl)
        .catch((e) => console.warn('Failed to clean up image:', e));
    }

    revalidatePublishedProjects();

    return NextResponse.json({
      message: `Project "${existingProject.title}" by ${existingProject.author.fullname} deleted successfully`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
