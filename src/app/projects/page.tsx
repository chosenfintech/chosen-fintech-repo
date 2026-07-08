// src/app/projects/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import ProjectsPageServer from '@/components/projects/ProjectsPageServer';
import ListQueryMemory from '@/components/ListQueryMemory';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore the projects and partnerships of Chosen Fintech Solutions — building blockchain communities, delivering Web3 education, and driving digital financial inclusion across Ghana and Africa.',
  alternates: {
    canonical: `${baseUrl}/projects`,
  },
  openGraph: {
    title: 'Projects — Chosen Fintech Solutions',
    description:
      'Discover how Chosen Fintech Solutions partners with organisations across the blockchain and Web3 ecosystem to build communities, deliver education, and drive meaningful adoption across Ghana and beyond.',
    url: `${baseUrl}/projects`,
    siteName: 'Chosen Fintech Solutions',
    images: [
      {
        url: '/open-graph-images/og-image-projects.png',
        width: 1200,
        height: 630,
        alt: 'Chosen Fintech Solutions Projects',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects — Chosen Fintech Solutions',
    description:
      'See how Chosen Fintech Solutions is partnering across the blockchain and Web3 ecosystem to deliver education and drive digital inclusion across Ghana and Africa.',
    site: '@chosenfintech',
    images: ['/open-graph-images/og-image-projects.png'],
  },
};

interface ProjectsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1') || 1;

  return (
    <>
      <Suspense fallback={null}>
        <ListQueryMemory />
      </Suspense>
      <NavBar />
      <Suspense fallback={null}>
        <ProjectsPageServer page={currentPage} />
      </Suspense>
      <Footer />
    </>
  );
}
