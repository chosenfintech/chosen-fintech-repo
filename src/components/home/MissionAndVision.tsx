'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  containerVariants,
  cardVariants,
  fadeUpVariants,
  lineRevealVariants,
} from '@/static-data/motion-variants';
import { motion } from 'motion/react';
import Image from 'next/image';

const features = [
  {
    title: 'Mission',
    description:
      'To educate, onboard and empower individuals and organisations to navigate digital technology for effective socio-economic systems.',
    image: '/mission-image.webp',
  },
  {
    title: 'Vision',
    description:
      'To be a global catalyst for fintech innovation, mass adoption and ethical governance.',
    image: '/vision-image.png',
  },
];

export function MissionAndVision() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          >
            <motion.div variants={fadeUpVariants}>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-foreground mb-6">
                MISSION & VISION
              </h2>
              <motion.div
                variants={lineRevealVariants}
                className="w-10 h-0.5 mx-auto mb-6 origin-left"
                style={{ backgroundColor: 'oklch(0.396 0.195 264)' }}
              />
            </motion.div>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={cardVariants}>
                <Card
                  className="overflow-hidden transition-shadow duration-300 h-full group p-0 border-none"
                  style={{
                    boxShadow: '0 4px 24px 0 oklch(0.396 0.195 264 / 0.25)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      '0 8px 36px 0 oklch(0.396 0.195 264 / 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      '0 4px 24px 0 oklch(0.396 0.195 264 / 0.25)';
                  }}
                >
                  <CardContent className="p-0 relative h-full min-h-100">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                          backgroundColor: 'oklch(0.396 0.195 264 / 0.85)',
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLDivElement
                          ).style.backgroundColor =
                            'oklch(0.396 0.195 264 / 0.75)';
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLDivElement
                          ).style.backgroundColor =
                            'oklch(0.396 0.195 264 / 0.80)';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                      {/* Accent line */}
                      <div className="w-8 h-0.5 bg-white/60 mb-4" />
                      <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-white/90 text-base md:text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
