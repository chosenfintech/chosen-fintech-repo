// src/app/contact/page.tsx
import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import ContactPageClient from '@/components/contact/ContactPageClient';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Chosen Fintech Solutions — reach out via email, phone, or visit us in Tamale, Ghana. We are happy to answer your questions about our fintech education programmes and blockchain initiatives.',
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us — Chosen Fintech Solutions',
    description:
      'Have a question or want to work with us? Contact Chosen Fintech Solutions in Tamale, Ghana — via email, phone, or in person. We would love to hear from you.',
    url: `${baseUrl}/contact`,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image-contact.png',
        width: 1200,
        height: 630,
        alt: 'Contact Chosen Fintech Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — Chosen Fintech Solutions',
    description:
      'Reach out to Chosen Fintech Solutions via email, phone, or visit us in Tamale, Ghana. We are here to help with all your fintech education enquiries.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image-contact.png'],
  },
};

export default function ContactPage() {
  return (
    <>
      <NavBar />
      <ContactPageClient />
      <Footer />
    </>
  );
}
