'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, Variants } from 'motion/react';

const stats = [
  { value: '7+', label: 'CITIES VISITED' },
  { value: '100+', label: 'COMMUNITY MEETUPS' },
  { value: '50+', label: 'CAMPUS MEETUPS' },
  { value: '5000+', label: 'PARTICIPANTS' },
];

// Extract numeric value from string (e.g., "250+" -> 250, "37k" -> 37000)
const parseStatValue = (value: string): number => {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (value.toLowerCase().includes('k')) {
    return num * 1000;
  }
  return num;
};

// Format the number back to original style
const formatStatValue = (current: number, original: string): string => {
  if (original.toLowerCase().includes('k')) {
    return `${Math.floor(current / 1000)}k`;
  }
  if (original.includes('+')) {
    return `${Math.floor(current)}+`;
  }
  return Math.floor(current).toString();
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
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

const statVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

interface AnimatedStatProps {
  value: string;
  label: string;
  index: number;
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({ value, label, index }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const targetValue = parseStatValue(value);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetValue / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, targetValue]);

  return (
    <motion.div
      ref={ref}
      variants={statVariant}
      className="text-center lg:text-left"
    >
      <div className="inline-block">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-light mb-4 text-accent-foreground"
        >
          {formatStatValue(count, value)}
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: index * 0.1 + 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-0.5 w-full bg-accent-foreground opacity-30 mb-3 rounded-full origin-left"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 0.9, y: 0 } : {}}
        transition={{
          duration: 0.5,
          delay: index * 0.1 + 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="font-light text-sm tracking-widest uppercase text-primary-foreground"
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

export function StatsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={container}
      className="bg-primary py-16 md:py-20 lg:py-24 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          <motion.div variants={fadeUp} className="w-full lg:w-1/4 lg:pt-8">
            <div className="flex items-center gap-4">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-0.5 w-12 bg-accent rounded-full origin-left"
              />
              <h2 className="text-4xl font-semibold tracking-widest uppercase text-primary-foreground">
                OUR STATS
              </h2>
            </div>
          </motion.div>

          <motion.div variants={container} className="w-full lg:w-3/4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 md:gap-8 lg:gap-12 justify-items-center lg:justify-items-start">
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
