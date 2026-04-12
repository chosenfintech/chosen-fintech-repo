// src/components/home/AboutFounder.tsx
'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import {
  containerVariants,
  imageVariants,
  contentVariants,
  textVariants,
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
                  My journey into fintech began in 2017 during my time on
                  campus, driven by volunteerism, youth leadership, and a
                  passion for financial and technology innovation. After earning
                  my Bachelor&apos;s degree in Integrated Business Studies
                  (Accounting) from the University for Development Studies in
                  2019, and completing my mandatory National Service in 2020
                  amid the global COVID-19 pandemic, I found myself at a
                  defining moment.
                </p>

                <p>
                  The period of lockdown, isolation, and social distancing
                  offered a rare opportunity for deep reflection and active
                  engagement in virtual learning and professional communities.
                  It was during this time that the vision for Chosen Fintech
                  Solutions was born.
                </p>

                <p>
                  What started as a personal pursuit evolved into a clear
                  mission; to formalize my fintech activities into a structured
                  and scalable organization. Today, Chosen Fintech Solutions is
                  committed to delivering impactful financial and technology
                  education, empowering youth and institutions with the
                  knowledge and tools needed to thrive in a rapidly evolving
                  digital economy.
                </p>

                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground text-base sm:text-lg">
                    — Mohammed Mustapha Yakubu
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Founder & CEO
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    MBA (Operations) · MSc ICT · BA Business (Accounting)
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
