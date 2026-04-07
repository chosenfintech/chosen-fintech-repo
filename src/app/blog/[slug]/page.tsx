// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostDetailClient from '@/components/posts/detail/DetailClient';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { IPost, IPostResponse } from '@/types/posts/post.types';
import { cache } from 'react';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

const fetchPost = cache(async function fetchPost(
  slug: string,
): Promise<IPost | null> {
  try {
    const url = new URL(`/api/posts/${slug}`, baseUrl);
    const postResponse = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!postResponse.ok) {
      console.error('Post fetch failed:', postResponse.statusText);
      return null;
    }

    const post: IPostResponse = await postResponse.json();
    return post.data;
  } catch (err) {
    console.error('Error fetching post:', err);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: 'Blog',
      description: 'Discover inspiring stories and updates from our community.',
      openGraph: {
        title: 'Blog',
        description:
          'Discover inspiring stories and updates from our community.',
        url: `${baseUrl}/blog/${slug}`,
        images: [
          {
            url: '/open-graph-images/og-image-blog.png',
            width: 1200,
            height: 630,
            alt: 'Hereafter Ghana Blog Fallback Image',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog | Hereafter Ghana',
        description:
          'Discover inspiring stories and updates from our community.',
        site: '@Hereafter_Ghana',
        images: ['/open-graph-images/og-image-blog.png'],
      },
    };
  }

  const ogImage = post.coverImage
    ? post.coverImage
    : '/open-graph-images/og-image-blog.png';

  return {
    title: `${post.title}`,
    description: post.excerpt || 'Read this article on Hereafter Ghana Blog.',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: 'Hereafter Ghana (My Hereafter Project - MHP)',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      site: '@Hereafter_Ghana',
      images: [ogImage],
    },
  };
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <NavBar />
      <div className="pt-24">
        <BlogPostDetailClient post={post} />
      </div>
      <Footer />
    </div>
  );
}
