// src/app/events/[slug]/page.tsx
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
      title: 'Events',
      description:
        'Discover the latest events, workshops, and community meetups from Chosen Fintech Solutions.',
      alternates: {
        canonical: `${baseUrl}/events/${slug}`,
      },
      openGraph: {
        title: 'Events — Chosen Fintech Solutions',
        description:
          'Discover the latest events, workshops, and community meetups from Chosen Fintech Solutions.',
        url: `${baseUrl}/events/${slug}`,
        siteName: 'Chosen Fintech Solutions',
        images: [
          {
            url: '/open-graph-images/og-image-events.png',
            width: 1200,
            height: 630,
            alt: 'Chosen Fintech Solutions Events',
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Events — Chosen Fintech Solutions',
        description:
          'Discover the latest events, workshops, and community meetups from Chosen Fintech Solutions.',
        site: '@chosenfintech',
        images: ['/open-graph-images/og-image-events.png'],
      },
    };
  }

  const ogImage = post.coverImage
    ? post.coverImage
    : '/open-graph-images/og-image-events.png';

  return {
    title: post.title,
    description:
      post.excerpt || 'Read this event post on Chosen Fintech Solutions.',
    alternates: {
      canonical: `${baseUrl}/events/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      url: `${baseUrl}/events/${post.slug}`,
      siteName: 'Chosen Fintech Solutions',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      site: '@chosenfintech',
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
