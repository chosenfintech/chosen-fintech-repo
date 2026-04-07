// src/app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { StoreProvider } from './StoreProvider';
import { ThemeProvider } from '@/components/theme-provider';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Chosen Fintech Solutions',
  description:
    'Empowering individuals and organizations with practical cryptocurrency education, specializing in the Cardano ecosystem and the future of decentralized finance (DeFi).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chosen Fintech',
    url: baseUrl,
    logo: `/logo.png`,
  };

  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chosen Fintech',
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
