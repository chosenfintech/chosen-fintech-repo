// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { requireAdmin } from '@/utils/require-admin';
import { cloudinaryService } from '@/config/claudinary';
import { generateSlug } from '@/utils/generate-slug';
import { calculateReadTime } from '@/utils/read-time-calculator';
import {
  buildProjectWhereClause,
  fetchProjectsWithPagination,
  mapProjectsToResponse,
} from '@/utils/project-utils';
import type {
  IProjectsPaginatedResponse,
  IProjectsQueryParams,
} from '@/types/projects/project.types';
import { createProjectSchema } from '@/validations/projects/project-validation';
import { handleApiError, ValidationError } from '@/middlewares/error-handler';
import { parseBoolean } from '@/utils/parse-booleans';
import {
  uploadBase64ContentImages,
  deleteUploadedContentImages,
} from '@/utils/content-images';
import { revalidatePublishedProjects } from '@/utils/revalidate-projects';

const PROJECTS_UPLOAD_FOLDER = 'chosen-fintech/projects-images';

/**
 * GET /api/projects
 * Protected — returns all projects with pagination and filters (admin use).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await verifySession();

    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const queryParams: IProjectsQueryParams = {
      authorId: searchParams.get('authorId') ?? undefined,
      isPublished:
        parseBoolean(searchParams.get('isPublished'), null) ?? undefined,
      isFeatured:
        parseBoolean(searchParams.get('isFeatured'), null) ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const whereClause = buildProjectWhereClause(queryParams);

    const { projects, total } = await fetchProjectsWithPagination(
      whereClause,
      page,
      limit,
    );

    const paginatedResponse: IProjectsPaginatedResponse = {
      message: 'Projects retrieved successfully',
      data: mapProjectsToResponse(projects),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    return NextResponse.json(paginatedResponse);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/projects
 * Protected — creates a new project. Accepts multipart/form-data.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let uploadedImageUrl: string | undefined;
  let uploadedContentPublicIds: string[] = [];

  try {
    const session = await verifySession();
    requireAdmin(session);
    const authorId = session.userId;

    const formData = await req.formData();

    const rawBody: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'imageUrl') continue;
      rawBody[key] = value;
    }

    const validation = createProjectSchema.safeParse(rawBody);
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

    const imageFile = formData.get('imageUrl');
    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const result = await cloudinaryService.uploadImage(
        { buffer, originalname: imageFile.name, mimetype: imageFile.type },
        { folder: PROJECTS_UPLOAD_FOLDER },
      );
      uploadedImageUrl = result.secure_url;
    }

    const contentResult = await uploadBase64ContentImages(
      projectDetails.content,
    );
    const processedContent = contentResult.html;
    uploadedContentPublicIds = contentResult.uploadedPublicIds;

    const calculatedReadTime = calculateReadTime(processedContent);

    const isPublished = projectDetails.isPublished ?? false;
    const publishDate =
      projectDetails.publishDate && isPublished
        ? new Date(projectDetails.publishDate)
        : isPublished
          ? new Date()
          : null;

    const result = await prisma.project.create({
      data: {
        title: projectDetails.title,
        slug: generateSlug(projectDetails.title),
        description: projectDetails.description,
        content: processedContent,
        readTime: calculatedReadTime,
        imageUrl: uploadedImageUrl ?? null,
        isPublished,
        isFeatured: projectDetails.isFeatured ?? false,
        publishDate,
        authorId,
        ...(projectDetails.createdAt && {
          createdAt: new Date(projectDetails.createdAt),
        }),
        ...(projectDetails.updatedAt && {
          updatedAt: new Date(projectDetails.updatedAt),
        }),
      },
      include: { author: { select: { id: true, fullname: true, email: true } } },
    });

    revalidatePublishedProjects();

    return NextResponse.json(
      {
        message: 'Project created successfully',
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
      },
      { status: 201 },
    );
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
