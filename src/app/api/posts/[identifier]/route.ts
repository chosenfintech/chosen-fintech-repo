// src/app/api/posts/[identifier]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/posts/[identifier]
 * Public — fetch a single post by UUID or slug.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
): Promise<NextResponse> {
  try {
    const { identifier } = await params;

    if (!identifier) {
      return NextResponse.json(
        { error: 'Post identifier is required' },
        { status: 400 },
      );
    }

    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        author: {
          select: { id: true, fullname: true, email: true },
        },
        category: { select: { id: true, name: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Post retrieved successfully',
      data: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        readTime: post.readTime,
        coverImage: post.coverImage,
        isPublished: post.isPublished,
        isFeatured: post.isFeatured,
        publishDate: post.publishDate,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        category: post.category ?? null,
      },
    });
  } catch (error) {
    console.error('GET /api/posts/[identifier] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
