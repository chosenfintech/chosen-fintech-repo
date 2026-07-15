// src/components/home/Partners.tsx
'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import {
  containerVariants,
  itemVariants,
  textVariants,
} from '@/static-data/motion-variants';

const partners = [
  { name: 'Cardano', logo: '/cardano-ghana-community-partner.png' },
  { name: 'Project Catalyst', logo: '/project-catalyst-logo.png' },
  {
    name: 'Africa Real Estate International',
    logo: '/africa-real-estate-international.png',
  },
];

export function Partners() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-12 md:my-16 lg:my-20">
      <motion.div
        className="relative overflow-hidden rounded-3xl px-6 py-12 md:px-10 md:py-14 lg:px-16"
        style={{ backgroundColor: 'oklch(0.396 0.195 264)' }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Decorative rings */}
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full border border-white/10"
        />

        <motion.h2
          className="relative flex items-center justify-center gap-4 mb-10 md:mb-12"
          variants={textVariants}
        >
          <span aria-hidden className="h-px w-8 sm:w-12 bg-white/30" />
          <span className="text-xs md:text-sm font-light text-white/80 uppercase tracking-[0.3em] text-center">
            TRUSTED BY BIG ONES.
          </span>
          <span aria-hidden className="h-px w-8 sm:w-12 bg-white/30" />
        </motion.h2>

        <div className="relative flex flex-wrap justify-center items-center gap-x-4 gap-y-6 sm:gap-x-10 md:gap-x-14 lg:gap-x-20">
          {partners.map(({ name, logo }) => (
            <motion.div
              key={name}
              variants={itemVariants}
              className="flex items-center justify-center h-8 w-20 sm:h-12 sm:w-36 lg:h-16 lg:w-40"
            >
              <Image
                src={logo}
                alt={`${name} logo`}
                width={160}
                height={64}
                className="object-contain w-full h-full opacity-80 transition duration-300 hover:opacity-100 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
