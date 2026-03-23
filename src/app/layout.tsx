// src/app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Chosen Fintech',
  description:
    'Empowering individuals and organizations with practical cryptocurrency education, specializing in the Cardano ecosystem and the future of decentralized finance (DeFi).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased flex flex-col min-h-screen`}
      >
        <main className="flex-1"> {children}</main>
      </body>
    </html>
  );
}
