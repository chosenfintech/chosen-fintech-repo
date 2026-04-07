// src/components/home/AboutFounder.tsx
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  containerVariants,
  imageVariants,
  contentVariants,
  textVariants,
  hoverVariants,
} from '@/static-data/motion-variants';

export function AboutFounder() {
  return (
    <section className="relative bg-muted/30 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]  xl:gap-20 2xl:gap-28 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* IMAGE */}
          <motion.div
            className="relative h-105 sm:h-130 lg:h-160 xl:h-180"
            variants={imageVariants}
          >
            <Image
              src="/founder.jpg"
              alt="Founder of Chosen Fintech"
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          {/* CONTENT */}
          <div className="container">
            <motion.div
              className="max-w-xl py-16 sm:py-20 lg:py-24 px-4"
              variants={contentVariants}
            >
              <motion.h2
                className="font-display text-primary font-semibold text-2xl sm:text-3xl md:text-4xl xl:text-5xl mb-6 leading-tight"
                variants={textVariants}
              >
                FROM OUR FOUNDER
              </motion.h2>

              <motion.div
                className="space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed mb-8"
                variants={textVariants}
              >
                <p>
                  &quot;When I started Chosen Fintech, my vision was simple:
                  make blockchain technology and cryptocurrency accessible to
                  everyone. Too often, financial innovation leaves behind the
                  very people who could benefit most from it.&quot;
                </p>

                <p>
                  &quot;We chose Cardano as our focus because it represents what
                  we believe in — a technology built on rigorous research,
                  designed for sustainability, and committed to real-world
                  impact.&quot;
                </p>

                <p className="font-medium text-foreground">
                  — Yakub Mohammed Mustapha, Founder & CEO
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
                    href="/about"
                    className="flex items-center justify-center"
                  >
                    <span className="relative z-20 group-hover:text-primary-foreground transition-colors duration-300">
                      Read Our Full Story
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
