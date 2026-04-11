'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { IAcademyGuide } from '@/static-data/academy-guides';
import {
  containerVariants,
  fadeUpVariants,
  lineRevealVariants,
  cardVariants,
} from '@/static-data/motion-variants';

interface EducationalGuidesProps {
  guides: IAcademyGuide[];
}

export function EducationalGuides({ guides }: EducationalGuidesProps) {
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
                        src={guide.image}
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
                        <p className="text-primary-foreground/90 text-sm leading-relaxed mb-5">
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
        </div>
      </div>
    </section>
  );
}
