'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  containerVariants,
  fadeUpVariants,
  lineRevealVariants,
} from '@/static-data/motion-variants';

interface WhoWeAreProps {
  description: string;
  vision: string;
  mission: string;
}

export const WhoWeAre: React.FC<WhoWeAreProps> = ({
  description,
  vision,
  mission,
}) => {
  return (
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
            {/* Left Column - Sticky Header */}
            <motion.div
              variants={fadeUpVariants}
              className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
                WHO
                <br />
                WE
                <br />
                ARE?
              </h2>

              <motion.div
                variants={lineRevealVariants}
                className="w-10 h-0.5 bg-primary mt-4 origin-left"
              />
            </motion.div>

            {/* Right Column */}
            <motion.div
              variants={containerVariants}
              className="lg:col-span-9 space-y-8"
            >
              {/* Description */}
              <motion.p
                variants={fadeUpVariants}
                className="text-muted-foreground leading-relaxed text-[18px] font-light max-w-3xl"
              >
                {description}
              </motion.p>

              {/* Vision */}
              <motion.div variants={fadeUpVariants} className="max-w-3xl">
                <h3 className="font-display text-xl font-bold text-primary mb-3">
                  VISION
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[18px] font-light">
                  {vision}
                </p>
              </motion.div>

              {/* Mission */}
              <motion.div variants={fadeUpVariants} className="max-w-3xl">
                <h3 className="font-display text-xl font-bold text-primary mb-3">
                  MISSION
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[18px] font-light">
                  {mission}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
