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
