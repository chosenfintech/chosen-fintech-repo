// src/app/about/faq/page.tsx
import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import FaqPageClient from '@/components/about/FaqPageClient';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Find answers to frequently asked questions about Chosen Fintech Solutions — covering blockchain, Cardano, cryptocurrency, DeFi, staking, and how to get started with our educational programmes.',
  alternates: {
    canonical: `${baseUrl}/about/faq`,
  },
  openGraph: {
    title: 'FAQ — Chosen Fintech Solutions',
    description:
      'Got questions about blockchain, Cardano, or DeFi? Browse our frequently asked questions to learn more about Chosen Fintech Solutions and how we can help you navigate the world of fintech and digital assets.',
    url: `${baseUrl}/about/faq`,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image-faq.png',
        width: 1200,
        height: 630,
        alt: 'Chosen Fintech Solutions FAQ',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ — Chosen Fintech Solutions',
    description:
      'Find answers to common questions about Chosen Fintech Solutions, blockchain education, Cardano, DeFi, and how to get started with our programmes.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image-faq.png'],
  },
};

export default function FaqPage() {
  return (
    <>
      <NavBar />
      <FaqPageClient />
      <Footer />
    </>
  );
}
