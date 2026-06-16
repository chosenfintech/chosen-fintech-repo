// src/app/projects/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Home, MoveRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import {
  IProject,
  IProjectResponse,
  IProjectsPaginatedResponse,
} from '@/types/projects/project.types';
import { PROJECTS_CACHE_TAG, POSTS_REVALIDATE_SECONDS } from '@/config/cache';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

const FALLBACK_IMAGE = '/open-graph-images/og-image-projects.png';

const fetchProject = cache(async (slug: string): Promise<IProject | null> => {
  try {
    const url = new URL(`/api/projects/published/${slug}`, baseUrl);
    const res = await fetch(url.toString(), {
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [PROJECTS_CACHE_TAG] },
    });
    if (!res.ok) return null;
    const data: IProjectResponse = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
});

const fetchOtherProjects = async (excludeSlug: string): Promise<IProject[]> => {
  try {
    const url = new URL('/api/projects/published', baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '20');
    const res = await fetch(url.toString(), {
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [PROJECTS_CACHE_TAG] },
    });
    if (!res.ok) return [];
    const data: IProjectsPaginatedResponse = await res.json();
    return data.data.filter((p) => p.slug !== excludeSlug);
  } catch {
    return [];
  }
};

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `${baseUrl}/projects/${slug}`,
    },
    openGraph: {
      title: `${project.title} — Chosen Fintech Solutions`,
      description: project.description,
      url: `${baseUrl}/projects/${slug}`,
      siteName: 'Chosen Fintech Solutions',
      images: [
        {
          url: '/open-graph-images/og-image-projects.png',
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Chosen Fintech Solutions`,
      description: project.description,
      site: '@chosenfintech',
      images: ['/open-graph-images/og-image-projects.png'],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) notFound();

  const otherProjects = await fetchOtherProjects(slug);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Banner */}
      <div className="relative w-full min-h-64 md:min-h-80 lg:min-h-96 overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'oklch(0.396 0.195 264 / 0.8)' }}
        />

        <div className="relative z-10 flex flex-col justify-end gap-4 h-full min-h-64 md:min-h-80 lg:min-h-96 px-4 sm:px-6 lg:px-8 pt-28 md:pt-40 pb-8 max-w-7xl mx-auto w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 text-primary-foreground/80">
            <Link
              href="/"
              className="hover:text-primary-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
            <MoveRight strokeWidth={0.5} className="w-4 h-4" />
            <Link
              href="/projects"
              className="text-xs sm:text-sm font-medium hover:text-primary-foreground transition-colors"
            >
              Projects
            </Link>
            <MoveRight strokeWidth={0.5} className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium text-primary-foreground line-clamp-1">
              {project.title}
            </span>
          </div>

          <div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground max-w-3xl leading-tight">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article */}
          <article className="lg:col-span-8">
            {/* Logo */}
            <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center p-4 mb-8 shadow-sm">
              <div className="relative w-full h-full">
                <Image
                  src={project.imageUrl || FALLBACK_IMAGE}
                  alt={`${project.title} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed border-l-4 border-primary pl-4 mb-8 italic">
              {project.description}
            </p>

            {/* HTML Content */}
            <div
              className="
                message-content w-full text-sm md:text-base leading-relaxed text-foreground
                break-words overflow-wrap-anywhere
                [&_p]:my-3 [&_p]:leading-7
                [&_p:first-child]:mt-0 [&_p:last-child]:mb-0
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-5 [&_h1]:tracking-tight
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-4 [&_h2]:tracking-tight
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-3
                [&_h4]:text-base [&_h4]:font-semibold [&_h4]:my-2
                [&_a]:text-blue-600 [&_a:hover]:text-blue-700
                dark:[&_a]:text-blue-400 dark:[&_a:hover]:text-blue-300
                [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1
                [&_li]:my-1 [&_li]:leading-7 [&_li>p]:my-1
                [&_li_ul]:my-2 [&_li_ol]:my-2
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary
                [&_blockquote]:bg-primary/5 [&_blockquote]:pl-4 [&_blockquote]:py-3
                [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:rounded-r-md
                [&_:not(pre)_code]:bg-muted [&_:not(pre)_code]:px-1.5
                [&_:not(pre)_code]:py-0.5 [&_:not(pre)_code]:rounded
                [&_:not(pre)_code]:text-[0.9em] [&_:not(pre)_code]:font-mono
                [&_pre]:bg-slate-900 [&_pre]:text-slate-50 [&_pre]:rounded-lg
                [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:text-sm
                [&_pre]:border [&_pre]:border-slate-800
                dark:[&_pre]:bg-slate-950 dark:[&_pre]:border-slate-800
                [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                [&_table]:text-sm [&_table]:border [&_table]:border-border [&_table]:rounded-lg
                [&_thead]:bg-muted/50
                [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2.5
                [&_th]:text-left [&_th]:font-semibold
                [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2
                [&_tbody_tr:hover]:bg-muted/30 [&_tbody_tr]:transition-colors
                [&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4
                [&_hr]:my-6 [&_hr]:border-t [&_hr]:border-border
                [&_strong]:font-semibold [&_strong]:text-foreground
                [&_em]:italic
              "
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h2 className="font-display font-bold text-primary text-lg mb-4 uppercase tracking-wide">
                  Other Projects
                </h2>
                <ul className="space-y-3">
                  {otherProjects.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="flex items-start gap-3 group p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                          <div className="relative w-full h-full">
                            <Image
                              src={p.imageUrl || FALLBACK_IMAGE}
                              alt={`${p.title} logo`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug mt-1">
                          {p.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
