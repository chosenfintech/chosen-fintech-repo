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

const credentials = ['MBA (Operations)', 'MSc ICT', 'BA Business (Accounting)'];

export function AboutFounder() {
  return (
    <section className="relative bg-muted/30 overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* PORTRAIT */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-28"
            variants={imageVariants}
          >
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Flat offset accents */}
              <div
                aria-hidden
                className="absolute -top-4 -right-4 w-2/3 h-2/3 rounded-3xl border-2 border-primary/25"
              />
              <div
                aria-hidden
                className="absolute -bottom-4 -left-4 w-2/3 h-2/3 rounded-3xl bg-primary/10"
              />
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/founder.jpg"
                  alt="Founder of Chosen Fintech"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* LETTER */}
          <motion.div className="lg:col-span-7" variants={contentVariants}>
            <motion.h2
              className="flex items-center gap-3 mb-6"
              variants={textVariants}
            >
              <span aria-hidden className="w-10 h-0.5 bg-primary" />
              <span className="font-display uppercase tracking-[0.25em] text-sm sm:text-base font-semibold text-primary dark:text-foreground">
                From Our Founder
              </span>
            </motion.h2>

            <motion.div variants={textVariants}>
              <div className="space-y-5">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <span
                    aria-hidden
                    className="float-left font-serif text-4xl sm:text-5xl leading-[0.8] text-primary/25 select-none mr-2"
                  >
                    &ldquo;
                  </span>
                  My journey into fintech began in 2017 during my time on
                  campus, driven by volunteerism, youth leadership, and a
                  passion for financial and technology innovation. After earning
                  my Bachelor&apos;s degree in Integrated Business Studies
                  (Accounting) from the University for Development Studies in
                  2019, and completing my mandatory National Service in 2020
                  amid the global COVID-19 pandemic, I found myself at a
                  defining moment.
                </p>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The period of lockdown, isolation, and social distancing
                  offered a rare opportunity for deep reflection and active
                  engagement in virtual learning and professional communities.
                  It was during this time that the vision for Chosen Fintech
                  Solutions was born.
                </p>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  What started as a personal pursuit evolved into a clear
                  mission; to formalize my fintech activities into a structured
                  and scalable organization. Today, Chosen Fintech Solutions is
                  committed to delivering impactful financial and technology
                  education, empowering youth and institutions with the
                  knowledge and tools needed to thrive in a rapidly evolving
                  digital economy.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-10">
                <div aria-hidden className="w-10 h-0.5 bg-primary/60 mb-6" />
                <p className="font-display text-base sm:text-lg font-semibold text-foreground">
                  — Mohammed Mustapha Yakubu
                </p>
                <p className="text-sm font-medium text-primary dark:text-foreground/70 mt-1">
                  Founder &amp; CEO
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {credentials.map((credential) => (
                    <span
                      key={credential}
                      className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary dark:text-foreground/80"
                    >
                      {credential}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
