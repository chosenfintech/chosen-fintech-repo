// src/components/WhatWeDo.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import {
  cardVariants,
  containerVariants,
  fadeUpVariants,
  lineRevealVariants,
} from '@/static-data/motion-variants';

export interface FocusArea {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface WhatWeDoProps {
  description: string;
  focusAreas: FocusArea[];
}

export const WhatWeDo: React.FC<WhatWeDoProps> = ({
  description,
  focusAreas,
}) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
      className="bg-foreground py-16 md:py-24"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Sticky Header */}
          <motion.div
            variants={fadeUpVariants}
            className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-background leading-tight">
              WHAT
              <br />
              WE
              <br />
              DO
            </h2>

            <motion.div
              variants={lineRevealVariants}
              className="w-10 h-0.5 bg-background mt-4 origin-left"
            />

            <p className="mt-4 text-gray-400 leading-relaxed">{description}</p>
          </motion.div>

          {/* Right Column - Cards */}
          <motion.div
            variants={containerVariants}
            className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {focusAreas.map((area) => (
              <motion.div
                key={area.title}
                variants={cardVariants}
                whileHover="hover"
                className="relative group"
              >
                <Card className="relative bg-[#252b3b] border border-[#2a3142] rounded-[5px] overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-primary z-0"
                    initial={{ scaleX: 0 }}
                    variants={{
                      hover: {
                        scaleX: 1,
                        transition: {
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      },
                    }}
                    style={{ originX: 0 }}
                  />

                  <CardContent className="relative z-10 p-8 h-full flex flex-col justify-between">
                    <div className="w-10 h-10 mb-6">
                      <motion.div
                        variants={{
                          hover: { scale: 1.15 },
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <area.icon className="w-full h-full text-primary group-hover:text-white transition-colors duration-300" />
                      </motion.div>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-white mb-2">
                        {area.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                        {area.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
