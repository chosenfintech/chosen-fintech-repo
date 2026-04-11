'use client';

import { motion } from 'motion/react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/ui/PageHero';
import { projects } from '@/static-data/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import {
  containerVariants,
  cardVariants,
  fadeUpVariants,
  lineRevealVariants,
} from '@/static-data/motion-variants';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}