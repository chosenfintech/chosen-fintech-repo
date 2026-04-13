// src/components/donate/DonatePageClient.tsx
'use client';

import { motion } from 'motion/react';
import { Cpu, Users, BookOpen, TrendingUp } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { DonateMethods } from '@/components/donate/DonateMethods';
import {
  containerVariants,
  fadeUpVariants,
  lineRevealVariants,
  cardVariants,
} from '@/static-data/motion-variants';
import Image from 'next/image';
import { FOOTER_DEEP_BLUE } from '@/components/donate/DonateMethods';

const impactItems = [
  {
    icon: Cpu,
    title: 'Accessible Fintech',
    description:
      'Build tools and platforms that bring financial services to those historically left out.',
  },
  {
    icon: Users,
    title: 'Underserved Communities',
    description:
      'Support individuals and small businesses in navigating the digital economy.',
  },
  {
    icon: BookOpen,
    title: 'Financial Literacy',
    description:
      'Fund education programmes that build lasting digital and financial competence.',
  },
  {
    icon: TrendingUp,
    title: 'Economic Opportunity',
    description:
      'Create pathways to sustainable income through technology and innovation.',
  },
];

export default function DonatePageClient() {
  return (
    <>
      <PageHero title="Support Our Mission" />

      {/* ── Intro ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="font-light"
      >
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left sticky heading */}
              <motion.div
                variants={fadeUpVariants}
                className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary dark:text-foreground leading-tight">
                  WHY
                  <br />
                  IT
                  <br />
                  MATTERS
                </h2>
                <motion.div
                  variants={lineRevealVariants}
                  className="w-10 h-0.5 bg-primary dark:bg-foreground mt-4 origin-left"
                />
              </motion.div>

              {/* Right content */}
              <motion.div
                variants={containerVariants}
                className="lg:col-span-9 space-y-6"
              >
                <motion.p
                  variants={fadeUpVariants}
                  className="text-muted-foreground leading-relaxed text-[18px] font-light max-w-3xl"
                >
                  At Chosen Fintech Solutions, we are advancing inclusive
                  financial solutions that empower underserved communities and
                  drive sustainable impact. As a social enterprise, your support
                  helps us expand access, innovate responsibly, and reach those
                  who need it most.
                </motion.p>
                <motion.p
                  variants={fadeUpVariants}
                  className="text-muted-foreground leading-relaxed text-[18px] font-light max-w-3xl"
                >
                  Every contribution — big or small — directly fuels our work in
                  financial inclusion, digital empowerment, youth leadership,
                  and community transformation.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Ways to Donate ── */}
      <DonateMethods />

      {/* ── Why Your Support Matters ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="bg-background py-16 md:py-24"
      >
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left sticky heading */}
            <motion.div
              variants={fadeUpVariants}
              className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary dark:text-foreground leading-tight">
                YOUR
                <br />
                IMPACT
              </h2>
              <motion.div
                variants={lineRevealVariants}
                className="w-10 h-0.5 bg-primary dark:bg-foreground mt-4 origin-left"
              />
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Here is what your donation directly makes possible.
              </p>
            </motion.div>

            {/* 2×2 impact grid */}
            <motion.div
              variants={containerVariants}
              className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {impactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={cardVariants}
                    className="flex gap-4 p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-card-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── Thank You ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="relative py-16 md:py-20 overflow-hidden"
        style={{ backgroundColor: FOOTER_DEEP_BLUE }}
      >
        {/* Background image with gradient overlays */}
        <div className="absolute inset-0">
          <Image src="/hero-bg.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[oklch(0.396_0.195_264)]/80" />
          <div className="absolute inset-0 bg-linear-to-br from-[oklch(0.396_0.195_264)]/40 via-transparent to-[oklch(0.396_0.195_264)]/20" />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={fadeUpVariants}
            className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6"
          >
            THANK YOU
          </motion.h2>
          <motion.div
            variants={lineRevealVariants}
            className="w-10 h-0.5 bg-primary-foreground mx-auto mb-8 origin-center"
          />
          <motion.p
            variants={fadeUpVariants}
            className="text-primary-foreground/90 leading-relaxed text-lg max-w-2xl mx-auto font-light"
          >
            We are deeply grateful for your support in helping us create and
            shape a more inclusive and empowered financial and tech future.
          </motion.p>
        </div>
      </motion.section>
    </>
  );
}
