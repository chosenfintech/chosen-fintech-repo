'use client';

import Link from 'next/link';
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
  textVariants,
} from '@/static-data/motion-variants';
import { projects } from '@/static-data/projects';
import { ProjectCard } from '../projects/ProjectCard';

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
              variants={textVariants}
              initial="rest"
              whileHover="hover"
            >
              <Button
                variant="outline"
                size="lg"
                className="relative z-10 border-2 border-primary/30 text-foreground rounded-full backdrop-blur-sm h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium overflow-hidden group transition-colors duration-300"
                asChild
              >
                <Link
                  href="/projects"
                  className="flex items-center justify-center"
                >
                  <span className="relative z-20 group-hover:text-primary-foreground transition-colors duration-300">
                    See All Projects
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
              <motion.div key={project.id} variants={cardVariants}>
                <ProjectCard project={project} priority={index === 0} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
