// src/components/home/Hero.tsx
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  containerVariants,
  headlineVariants,
  hoverVariants,
  subtextVariants,
  buttonVariants,
} from '@/static-data/motion-variants';

export function Hero() {
  return (
    <section className="relative min-h-screen pt-28 flex items-center justify-center overflow-hidden text-center">
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* Fixed Cardano blue overlay — same in light and dark */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'oklch(0.396 0.195 264 / 0.85)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom right, oklch(0.396 0.195 264 / 0.4), transparent, oklch(0.396 0.195 264 / 0.2))',
          }}
        />
      </div>

      <motion.div
        className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl 2xl:max-w-6xl py-20 md:py-24 lg:py-32 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-display text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold text-white leading-[1.1] sm:leading-tight mb-6 sm:mb-8 2xl:mb-10"
          variants={headlineVariants}
        >
          EMPOWERING THE FUTURE OF FINANCIAL TECHNOLOGY
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl 2xl:text-2xl 3xl:text-3xl font-light text-white/90 leading-relaxed mb-8 sm:mb-10 md:mb-12 2xl:mb-14 max-w-2xl 2xl:max-w-4xl"
          variants={subtextVariants}
        >
          Chosen Fintech Solutions is your trusted partner in fintech education
          and decentralised tech governance with a focus on blockchain and
          digital innovation and adoption.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 2xl:gap-6 w-full"
          variants={buttonVariants}
        >
          {/* Primary CTA — white button with blue text */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              size="lg"
              className="rounded-full shadow-lg h-12 sm:h-14 2xl:h-16 3xl:h-18 px-6 sm:px-8 2xl:px-10 3xl:px-12 text-sm sm:text-base 2xl:text-lg 3xl:text-xl font-medium"
              style={{
                backgroundColor: 'white',
                color: 'oklch(0.396 0.195 264)',
              }}
              asChild
            >
              <Link
                href="/academy"
                className="flex items-center justify-center"
              >
                Learn Fintech
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6" />
              </Link>
            </Button>
          </motion.div>

          {/* Secondary CTA — outline with white border, hover fills blue */}
          <motion.div initial="rest" whileHover="hover" className="relative">
            <Button
              size="lg"
              variant="outline"
              className="relative z-10 !border-white text-white rounded-full backdrop-blur-sm h-12 sm:h-14 2xl:h-16 3xl:h-18 px-6 sm:px-8 2xl:px-10 3xl:px-12 text-sm sm:text-base 2xl:text-lg 3xl:text-xl font-medium overflow-hidden group transition-colors duration-300 bg-transparent hover:bg-transparent"
              asChild
            >
              <Link
                href="/projects"
                className="flex items-center justify-center"
              >
                <span className="relative z-20 text-white group-hover:text-white transition-colors duration-300">
                  <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 inline" />
                  Explore Our Work
                </span>

                <motion.span
                  className="absolute inset-0 rounded-full z-10"
                  style={{ backgroundColor: 'oklch(0.396 0.195 264)' }}
                  variants={hoverVariants}
                />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
