// components/cardano/EducationalGuides.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";
import { motion, Variants } from "motion/react";
import Image from "next/image";

interface Guide {
  icon: LucideIcon;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  link: string;
}

interface EducationalGuidesProps {
  guides: Guide[];
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
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

export function EducationalGuides({ guides }: EducationalGuidesProps) {
  return (
    <section className="py-12 md:py-18 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
            className="text-center max-w-3xl mx-auto mb-6 md:mb-8"
          >
            <motion.div variants={fadeUp}>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary md:mb-3 ">
                EDUCATIONAL GUIDES
              </h2>
              <motion.div
                variants={lineReveal}
                className="w-10 h-0.5 bg-primary mx-auto origin-left  mt-4"
              />
              <p className="font-light text-base md:text-lg text-muted-foreground leading-relaxed mt-3 ">
                From beginner basics to advanced development, explore our
                curated learning paths for the Cardano ecosystem.
              </p>
            </motion.div>
          </motion.div>

          {/* Cards Grid - 3 columns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {guides.map((guide) => (
              <motion.div key={guide.title} variants={cardVariant}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full group p-0 border-border/50">
                  <CardContent className="p-0 relative h-full min-h-80">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-primary/80 transition-opacity duration-300 group-hover:bg-primary/75" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-7">
                      {/* Bottom - Text Content */}
                      <div>
                        <h3 className="font-display text-lg md:text-xl font-semibold text-primary-foreground mb-3 leading-tight">
                          {guide.title}
                        </h3>
                        <p className="text-primary-foreground/90 text-sm leading-relaxed mb-5">
                          {guide.description}
                        </p>
                        <a
                          href={guide.link}
                          className="inline-flex items-center gap-2 text-primary-foreground font-medium hover:gap-3 transition-all duration-300 group/link text-sm"
                        >
                          Start Learning
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
