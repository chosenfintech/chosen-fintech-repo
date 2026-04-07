// src/components/home/MissionAndVision.tsx
'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  containerVariants,
  cardVariants,
  fadeUpVariants,
  lineRevealVariants,
} from '@/static-data/motion-variants';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

const features = [
  {
    title: 'Mission',
    description:
      'To educate, onboard and empower individuals and organisations to navigate digital technology for effective socio-economic systems.',
    image: '/mission-image.webp',
    link: '/about',
  },
  {
    title: 'Vision',
    description:
      'To be a global catalyst for fintech innovation, mass adoption and ethical governance.',
    image: '/vision-image.png',
    link: '/about',
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
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
                MISSION & VISION
              </h2>
              <motion.div
                variants={lineRevealVariants}
                className="w-10 h-0.5 bg-primary mx-auto mb-6 origin-left"
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
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full group p-0 border-black">
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
                      {/* Overlay - Using primary color with opacity */}
                      <div className="absolute inset-0 bg-primary/80 transition-opacity duration-300 group-hover:bg-primary/75" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                      <div>
                        <h3 className="font-display text-xl md:text-2xl font-semibold text-primary-foreground mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-primary-foreground/90 leading-relaxed mb-6">
                          {feature.description}
                        </p>
                        <a
                          href={feature.link}
                          className="inline-flex items-center gap-2 text-primary-foreground font-medium hover:gap-3 transition-all duration-300 group/link"
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                        </a>
                      </div>
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
