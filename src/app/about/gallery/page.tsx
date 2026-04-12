// src/app/gallery/page.tsx
import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import GalleryPageClient from '@/components/gallery/GalleryPageClient';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Browse photos and highlights from Chosen Fintech Solutions — our events, workshops, community meetups, and blockchain education programmes across Ghana and Africa.',
  alternates: {
    canonical: `${baseUrl}/gallery`,
  },
  openGraph: {
    title: 'Gallery — Chosen Fintech Solutions',
    description:
      'A look at the moments that define us — events, workshops, community meetups, and blockchain education programmes organised by Chosen Fintech Solutions across Ghana and Africa.',
    url: `${baseUrl}/gallery`,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image-gallery.png',
        width: 1200,
        height: 630,
        alt: 'Chosen Fintech Solutions Gallery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery — Chosen Fintech Solutions',
    description:
      'Browse photos and highlights from Chosen Fintech Solutions events, workshops, and blockchain education programmes across Ghana and Africa.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image-gallery.png'],
  },
};

export default function GalleryPage() {
  return (
    <div>
      <NavBar />
      <GalleryPageClient />
      <Footer />
    </div>
  );
}
