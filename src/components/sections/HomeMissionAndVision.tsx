'use client';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'motion/react';
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

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HomeMissionAndVision() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={container}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          >
            <motion.div variants={fadeUp}>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
                MISSION & VISION
              </h2>
              <motion.div
                variants={lineReveal}
                className="w-10 h-0.5 bg-primary mx-auto mb-6 origin-left"
              />
            </motion.div>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={cardVariant}>
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
