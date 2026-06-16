// src/app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostDetailClient from '@/components/posts/detail/DetailClient';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { IPost, IPostResponse } from '@/types/posts/post.types';
import { cache } from 'react';
import { POSTS_CACHE_TAG, POSTS_REVALIDATE_SECONDS } from '@/config/cache';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

const fetchPost = cache(async function fetchPost(
  slug: string,
): Promise<IPost | null> {
  try {
    const url = new URL(`/api/posts/published/${slug}`, baseUrl);
    const postResponse = await fetch(url.toString(), {
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [POSTS_CACHE_TAG] },
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
      title: 'Post Not Found',
      description:
        'Explore articles, events, and educational content from Chosen Fintech Solutions.',
      alternates: {
        canonical: `${baseUrl}/posts/${slug}`,
      },
      openGraph: {
        title: 'Chosen Fintech Solutions',
        description:
          'Explore articles, events, and educational content from Chosen Fintech Solutions.',
        url: `${baseUrl}/posts/${slug}`,
        siteName: 'Chosen Fintech Solutions',
        images: [
          {
            url: '/open-graph-images/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Chosen Fintech Solutions',
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Chosen Fintech Solutions',
        description:
          'Explore articles, events, and educational content from Chosen Fintech Solutions.',
        site: '@chosenfintech',
        images: ['/open-graph-images/og-image.png'],
      },
    };
  }

  const ogImage = post.coverImage ?? '/open-graph-images/og-image.png';
  const description =
    post.excerpt || 'Read this post on Chosen Fintech Solutions.';

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${baseUrl}/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `${baseUrl}/posts/${post.slug}`,
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
      publishedTime: new Date(
        post.publishDate ?? post.createdAt,
      ).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.author.fullname],
      ...(post.category?.name && { section: post.category.name }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      site: '@chosenfintech',
      images: [ogImage],
    },
  };
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${baseUrl}/posts/${post.slug}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ?? `${baseUrl}/open-graph-images/og-image.png`,
    datePublished: new Date(post.publishDate ?? post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.fullname,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Chosen Fintech Solutions',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    ...(post.category?.name && { articleSection: post.category.name }),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <NavBar />
      <div className="pt-24">
        <BlogPostDetailClient post={post} />
      </div>
      <Footer />
    </div>
  );
}
