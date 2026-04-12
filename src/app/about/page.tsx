// src/app/about/page.tsx
import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import AboutPageClient from '@/components/about/AboutPageClient';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn more about Chosen Fintech Solutions — our mission, vision, founding story, and the dedicated team driving fintech education, blockchain adoption, and digital financial inclusion across Ghana and Africa.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'About Us — Chosen Fintech Solutions',
    description:
      'Discover the story of Chosen Fintech Solutions, founded in 2020 in Tamale, Ghana. Learn about our mission to educate and empower individuals and organisations through blockchain, DeFi, and financial technology across Africa.',
    url: `${baseUrl}/about`,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image-about.png',
        width: 1200,
        height: 630,
        alt: 'About Chosen Fintech Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — Chosen Fintech Solutions',
    description:
      'Learn more about Chosen Fintech Solutions, our mission, vision, and the team dedicated to driving fintech education, blockchain adoption, and digital inclusion across Ghana and Africa.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image-about.png'],
  },
};

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <AboutPageClient />
      <Footer />
    </>
  );
}
