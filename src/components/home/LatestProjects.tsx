// src/components/home/LatestProjects.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  containerVariants,
  hoverVariants,
  cardVariants,
  fadeUpVariants,
  lineRevealVariants,
} from '@/static-data/motion-variants';

const projects = [
  {
    imageUrl: '/cardano-ghana-community.png',
    title: 'Cardano Ghana',
    link: '/projects/cardano-ghana',
  },
  {
    imageUrl: '/scale-up-icp-logo.png',
    title: 'Scale-UP ICP Ghana',
    link: '/projects/scale-up-icp-ghana',
  },
  {
    imageUrl: '/bch-house-logo.jpeg',
    title: 'BCH House, Ghana',
    link: '/projects/bch-house-ghana',
  },
];

export function LatestProjects() {
  return (
    <section
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden"
      style={{ backgroundColor: 'oklch(0.396 0.195 264)' }}
    >
      {/* Background image with gradient overlays */}
      <div className="absolute inset-0">
        <Image src="/hero-bg.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[oklch(0.396_0.195_264)]/80" />
        <div className="absolute inset-0 bg-linear-to-br from-[oklch(0.396_0.195_264)]/40 via-transparent to-[oklch(0.396_0.195_264)]/20" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Button */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
          >
            <motion.div variants={fadeUpVariants} className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
                OUR PROJECTS
              </h2>
              <motion.div
                variants={lineRevealVariants}
                className="w-10 h-0.5 bg-primary-foreground mt-4 origin-left"
              />
              <p className="text-primary-foreground/90 mt-3">
                Our projects are built in close partnership with organizations
                to drive meaningful outcomes.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUpVariants}
              initial="rest"
              whileHover="hover"
            >
              <Button
                variant="outline"
                className="relative z-10 w-fit border-2 border-primary-foreground/30 text-primary-foreground backdrop-blur-sm h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium overflow-hidden group transition-colors duration-300"
                asChild
              >
                <Link
                  href="/projects"
                  className="flex items-center justify-center"
                >
                  <span className="relative z-20 text-primary group-hover:text-primary-foreground transition-colors duration-300">
                    View All Our Projects
                    <ArrowRight className="ml-2 w-4 h-4 inline transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-primary rounded-full z-10"
                    variants={hoverVariants}
                  />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Projects Cards Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {projects.map((project, index) => (
              <motion.div key={project.title} variants={cardVariants}>
                <Link href={project.link} className="group block h-full">
                  <Card className="overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 h-full flex flex-col">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      {/* Project Image/Logo Area */}
                      <div className="w-full aspect-square max-w-50 p-6 flex justify-center items-center bg-white rounded-xl mb-6 transition-transform duration-300 group-hover:scale-105">
                        <div className="relative w-full h-full">
                          <Image
                            src={project.imageUrl}
                            alt={`${project.title} logo`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index === 0}
                          />
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="font-display text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>

                      {/* Read More Link */}
                      <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300 mt-auto">
                        Read More
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
