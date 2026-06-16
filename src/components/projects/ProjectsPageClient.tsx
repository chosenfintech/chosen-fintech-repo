// src/components/projects/ProjectsPageClient.tsx
'use client';

import { motion } from 'motion/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FolderKanban } from 'lucide-react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { IProject } from '@/types/projects/project.types';
import {
  containerVariants,
  cardVariants,
  fadeUpVariants,
  lineRevealVariants,
} from '@/static-data/motion-variants';

interface ProjectsPageClientProps {
  projects: IProject[];
  currentPage: number;
  totalPages: number;
}

export default function ProjectsPageClient({
  projects,
  currentPage,
  totalPages,
}: ProjectsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) params.delete('page');
    else params.set('page', String(page));
    router.push(`/projects?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showPagination = totalPages > 1;

  return (
    <div className="min-h-screen bg-background">
      <PageHero title="Projects" />

      <section className="py-12 md:py-18 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={containerVariants}
              className="text-center max-w-3xl mx-auto mb-6 md:mb-8"
            >
              <motion.div variants={fadeUpVariants}>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary md:mb-3">
                  OUR PROJECTS
                </h2>
                <motion.div
                  variants={lineRevealVariants}
                  className="w-10 h-0.5 bg-primary mx-auto origin-left mt-4"
                />
                <p className="font-light text-base md:text-lg text-muted-foreground leading-relaxed mt-3">
                  We partner with organisations across the blockchain and Web3
                  ecosystem to build communities, deliver education, and drive
                  meaningful adoption across Ghana and beyond.
                </p>
              </motion.div>
            </motion.div>

            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                <p>No projects published yet. Check back soon.</p>
              </div>
            ) : (
              <>
                {/* Projects Grid */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                  {projects.map((project, index) => (
                    <motion.div key={project.id} variants={cardVariants}>
                      <ProjectCard project={project} priority={index === 0} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {showPagination && (
                  <div className="flex items-center justify-center gap-2 pt-10 lg:pt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-10 px-3 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>

                    <div className="flex items-center gap-1 lg:gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          const show =
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1);
                          const ellipsis =
                            (page === currentPage - 2 && currentPage > 3) ||
                            (page === currentPage + 2 &&
                              currentPage < totalPages - 2);
                          if (ellipsis)
                            return (
                              <span
                                key={page}
                                className="px-2 text-muted-foreground text-sm"
                              >
                                ...
                              </span>
                            );
                          if (!show) return null;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? 'default' : 'outline'
                              }
                              size="sm"
                              onClick={() => goToPage(page)}
                              className="min-w-10 h-10 font-medium"
                            >
                              {page}
                            </Button>
                          );
                        },
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-10 px-3 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
