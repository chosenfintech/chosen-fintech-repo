// src/app/projects/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { projects } from '@/static-data/projects';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const otherProjects = projects.filter((p) => p.slug !== slug);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'oklch(0.396 0.195 264)' }}
        />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto w-full">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground max-w-3xl leading-tight">
            {project.title}
          </h1>
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
                  src={project.imageUrl}
                  alt={`${project.title} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed border-l-4 border-primary pl-4 mb-8 italic">
              {project.description}
            </p>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {project.content.split('\n').map((paragraph, i) =>
                paragraph.trim() ? (
                  <p
                    key={i}
                    className="text-foreground/90 text-base md:text-lg leading-relaxed mb-6"
                  >
                    {paragraph}
                  </p>
                ) : null,
              )}
            </div>
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
                        {/* Thumbnail */}
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                          <div className="relative w-full h-full">
                            <Image
                              src={p.imageUrl}
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
