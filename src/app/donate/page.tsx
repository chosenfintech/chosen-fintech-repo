// src/app/donate/page.tsx
import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import DonatePageClient from '@/components/donate/DonatePageClient';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

export const metadata: Metadata = {
  title: 'Support Our Mission',
  description:
    'Support Chosen Fintech Solutions through crypto or fiat donations. Your contribution fuels financial inclusion, digital empowerment, and community transformation across Ghana and Africa.',
  alternates: {
    canonical: `${baseUrl}/donate`,
  },
  openGraph: {
    title: 'Support Our Mission — Chosen Fintech Solutions',
    description:
      'Donate to Chosen Fintech Solutions and help us advance inclusive financial solutions, digital empowerment, and youth leadership across Ghana and Africa.',
    url: `${baseUrl}/donate`,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image-donate.png',
        width: 1200,
        height: 630,
        alt: 'Support the Mission of Chosen Fintech Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support Our Mission — Chosen Fintech Solutions',
    description:
      'Your donation directly fuels fintech access, financial literacy, and community transformation. Support Chosen Fintech Solutions today.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image-donate.png'],
  },
};

export default function DonatePage() {
  return (
    <>
      <NavBar />
      <DonatePageClient />
      <Footer />
    </>
  );
}
