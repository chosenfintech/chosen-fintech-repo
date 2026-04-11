// src/app/academy/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { academyGuides } from '@/static-data/academy-guides';
import { Badge } from '@/components/ui/badge';

const levelColors: Record<'Beginner' | 'Intermediate' | 'Advanced', string> = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

interface AcademyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AcademyDetailPage({
  params,
}: AcademyDetailPageProps) {
  const { slug } = await params;
  const guide = academyGuides.find((g) => g.slug === slug);

  if (!guide) notFound();

  const otherGuides = academyGuides.filter((g) => g.slug !== slug);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={guide.image}
          alt={guide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto w-full">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Badge
              className={`text-xs font-medium border ${levelColors[guide.level]}`}
            >
              {guide.level}
            </Badge>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground max-w-3xl leading-tight">
            {guide.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article */}
          <article className="lg:col-span-8">
            <p className="text-muted-foreground text-lg leading-relaxed border-l-4 border-primary pl-4 mb-8 italic">
              {guide.description}
            </p>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {guide.content.split('\n').map((paragraph, i) => (
                <p
                  key={i}
                  className="text-foreground/90 text-base md:text-lg leading-relaxed mb-6"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h2 className="font-display font-bold text-primary text-lg mb-4 uppercase tracking-wide">
                  All Guides
                </h2>
                <ul className="space-y-3">
                  {otherGuides.map((g) => {
                    const Icon = g.icon;
                    return (
                      <li key={g.id}>
                        <Link
                          href={`/academy/${g.slug}`}
                          className="flex items-start gap-3 group p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="mt-0.5 text-primary shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                              {g.title}
                            </p>
                            <span
                              className={`text-xs font-medium mt-1 inline-block ${
                                levelColors[g.level].split(' ')[1]
                              }`}
                            >
                              {g.level}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
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
