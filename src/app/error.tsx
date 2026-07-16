'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';
import { motion, Variants } from 'motion/react';
import { Button } from '@/components/ui/button';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const headingVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 16,
    },
  },
};

const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 18,
    },
  },
};

const buttonsVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
    },
  },
};

const hoverVariants: Variants = {
  rest: { x: '-100%' },
  hover: {
    x: '0%',
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }, [error]);

  return (
    <section
      className="section-padding px-4 pt-42 pb-18 md:pt-56 md:pb-24
 flex items-center justify-center min-h-[60vh] overflow-hidden"
    >
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Oops */}
        <motion.div
          className="font-display text-8xl md:text-9xl font-bold gradient-text mb-4"
          variants={headingVariants}
        >
          Oops!
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
          variants={textVariants}
        >
          Something Went Wrong
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-muted-foreground mb-8 max-w-md mx-auto"
          variants={textVariants}
        >
          An unexpected error occurred while loading this page. Please try
          again, or head back home.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-row gap-4 justify-center"
          variants={buttonsVariants}
        >
          {/* Try Again – simple spring button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Button size="lg" onClick={() => reset()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </motion.div>

          {/* Go Home – animated sweep button */}
          <motion.div initial="rest" whileHover="hover" className="relative">
            <Button
              variant="outline"
              size="lg"
              className="relative z-10 overflow-hidden group"
              asChild
            >
              <Link href="/">
                <span className="relative z-20 flex items-center text-foreground group-hover:text-primary-foreground transition-colors duration-300">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </span>

                <motion.span
                  className="absolute inset-0 bg-primary z-10"
                  variants={hoverVariants}
                />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
