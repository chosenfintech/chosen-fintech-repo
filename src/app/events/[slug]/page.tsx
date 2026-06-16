// src/app/events/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogEventDetailClient from '@/components/events/detail/DetailClient';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { IEvent, IEventResponse } from '@/types/events/event.types';
import { cache } from 'react';
import { POSTS_CACHE_TAG, POSTS_REVALIDATE_SECONDS } from '@/config/cache';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

const fetchEvent = cache(async function fetchEvent(
  slug: string,
): Promise<IEvent | null> {
  try {
    const url = new URL(`/api/events/published/${slug}`, baseUrl);
    const eventResponse = await fetch(url.toString(), {
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [POSTS_CACHE_TAG] },
    });

    if (!eventResponse.ok) {
      console.error('Event fetch failed:', eventResponse.statusText);
      return null;
    }

    const event: IEventResponse = await eventResponse.json();
    return event.data;
  } catch (err) {
    console.error('Error fetching event:', err);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEvent(slug);

  if (!event) {
    return {
      title: 'Event Not Found',
      description:
        'Explore articles, events, and educational content from Chosen Fintech Solutions.',
      alternates: {
        canonical: `${baseUrl}/events/${slug}`,
      },
      openGraph: {
        title: 'Chosen Fintech Solutions',
        description:
          'Explore articles, events, and educational content from Chosen Fintech Solutions.',
        url: `${baseUrl}/events/${slug}`,
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

  const ogImage = event.coverImage ?? '/open-graph-images/og-image.png';
  const description =
    event.excerpt || 'Read this event on Chosen Fintech Solutions.';

  return {
    title: event.title,
    description,
    alternates: {
      canonical: `${baseUrl}/events/${event.slug}`,
    },
    openGraph: {
      title: event.title,
      description,
      url: `${baseUrl}/events/${event.slug}`,
      siteName: 'Chosen Fintech Solutions',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: new Date(
        event.publishDate ?? event.createdAt,
      ).toISOString(),
      modifiedTime: new Date(event.updatedAt).toISOString(),
      authors: [event.author.fullname],
      ...(event.category?.name && { section: event.category.name }),
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      site: '@chosenfintech',
      images: [ogImage],
    },
  };
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await fetchEvent(slug);

  if (!event) {
    notFound();
  }

  const eventUrl = `${baseUrl}/events/${event.slug}`;
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.excerpt,
    image: event.coverImage ?? `${baseUrl}/open-graph-images/og-image.png`,
    startDate: new Date(
      event.eventDate ?? event.publishDate ?? event.createdAt,
    ).toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    ...(event.location && {
      location: {
        '@type': 'Place',
        name: event.location,
      },
    }),
    organizer: {
      '@type': 'Organization',
      name: 'Chosen Fintech Solutions',
      url: baseUrl,
    },
    url: eventUrl,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <NavBar />
      <div className="pt-24">
        <BlogEventDetailClient event={event} />
      </div>
      <Footer />
    </div>
  );
}
