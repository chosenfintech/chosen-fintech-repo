// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { StoreProvider } from './StoreProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { NavHistoryTracker } from '@/components/BackLink';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s - Chosen Fintech Solutions',
    default:
      'Chosen Fintech Solutions — Empowering the Future of Financial Technology',
  },
  description:
    'Chosen Fintech Solutions is your trusted partner in fintech education and decentralised tech governance, with a focus on blockchain, digital innovation, and adoption. Specialising in the Cardano ecosystem and the future of decentralized finance (DeFi) across Ghana and Africa.',
  keywords: [
    'Chosen Fintech',
    'Chosen Fintech Solutions',
    'fintech Ghana',
    'fintech Africa',
    'blockchain Ghana',
    'cryptocurrency education',
    'Cardano Ghana',
    'Cardano ecosystem',
    'decentralized finance',
    'DeFi',
    'blockchain education',
    'digital innovation Ghana',
    'crypto adoption Africa',
    'decentralised tech governance',
    'Web3 Ghana',
    'digital finance',
    'financial technology Ghana',
    'blockchain adoption',
    'crypto Ghana',
  ],
  authors: [{ name: 'Chosen Fintech Solutions' }],
  creator: 'Chosen Fintech Solutions',
  publisher: 'Chosen Fintech Solutions',
  applicationName: 'Chosen Fintech Solutions',
  metadataBase: new URL(baseUrl),
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: 'Chosen Fintech',
    statusBarStyle: 'default',
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
  openGraph: {
    title:
      'Chosen Fintech Solutions — Empowering the Future of Financial Technology',
    description:
      'Your trusted partner in fintech education and decentralised tech governance, with a focus on blockchain, digital innovation, and adoption. Specialising in the Cardano ecosystem and DeFi across Ghana and Africa.',
    url: baseUrl,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Chosen Fintech Solutions — Empowering the Future of Financial Technology',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Chosen Fintech Solutions — Empowering the Future of Financial Technology',
    description:
      'Chosen Fintech Solutions is your trusted partner in fintech education and decentralised tech governance, with a focus on blockchain, digital innovation, and adoption across Ghana and Africa.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chosen Fintech Solutions',
    url: baseUrl,
    logo: `${baseUrl}/logo.jpg`,
    sameAs: [
      'https://fb.com/chosenfintech',
      'https://x.com/chosenfintech',
      'https://www.linkedin.com/company/chosenfintech/',
      'https://youtube.com/@cardanoghana',
    ],
  };

  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chosen Fintech Solutions',
    url: baseUrl,
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`,
      },
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased flex flex-col min-h-screen`}
      >
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 2000,
                loading: {
                  duration: Infinity,
                },
              }}
            />

            {/* Counts in-app route changes so BackLink knows when history exists */}
            <NavHistoryTracker />

            <main className="flex-1">{children}</main>

            {/* JSON-LD */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbsJsonLd),
              }}
            />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
