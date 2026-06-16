// src/components/academy/EducationalGuides.tsx
'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { IGuide } from '@/types/guides/guide.types';
import {
  containerVariants,
  fadeUpVariants,
  lineRevealVariants,
  cardVariants,
} from '@/static-data/motion-variants';

interface EducationalGuidesProps {
  guides: IGuide[];
  currentPage: number;
  totalPages: number;
}

const FALLBACK_IMAGE = '/open-graph-images/og-image-academy.png';

export function EducationalGuides({
  guides,
  currentPage,
  totalPages,
}: EducationalGuidesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) params.delete('guidePage');
    else params.set('guidePage', String(page));
    router.push(`/academy?${params.toString()}`, { scroll: false });
  };

  const showPagination = totalPages > 1;

  return (
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
                EDUCATIONAL GUIDES
              </h2>
              <motion.div
                variants={lineRevealVariants}
                className="w-10 h-0.5 bg-primary mx-auto origin-left mt-4"
              />
              <p className="font-light text-base md:text-lg text-muted-foreground leading-relaxed mt-3">
                From beginner basics to advanced development, explore our
                curated learning paths for the Cardano ecosystem.
              </p>
            </motion.div>
          </motion.div>

          {guides.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
              <p>No guides published yet. Check back soon.</p>
            </div>
          ) : (
            <>
              {/* Cards Grid - 3 columns */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {guides.map((guide) => (
                  <motion.div key={guide.id} variants={cardVariants}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full group p-0 border-border/50">
                      <CardContent className="p-0 relative h-full min-h-80">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <Image
                            src={guide.image || FALLBACK_IMAGE}
                            alt={guide.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-primary/80 transition-opacity duration-300 group-hover:bg-primary/75" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-7">
                          <div>
                            <h3 className="font-display text-lg md:text-xl font-semibold text-primary-foreground mb-3 leading-tight">
                              {guide.title}
                            </h3>
                            <p className="text-primary-foreground/90 text-sm leading-relaxed mb-5 line-clamp-3">
                              {guide.description}
                            </p>
                            <Link
                              href={`/academy/${guide.slug}`}
                              className="inline-flex items-center gap-2 text-primary-foreground font-medium hover:gap-3 transition-all duration-300 group/link text-sm"
                            >
                              Start Learning
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
  );
}
