// src/static-data/motion-variants.ts
import { Variants } from 'motion/react';

/**
 * Container (parent stagger control) — for small lists and sections.
 * For grids with many children, use gridContainerVariants instead.
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/**
 * Grid container — tighter stagger to prevent long wait times
 * when many children are present (e.g. photo gallery, card grid).
 * Add will-change: 'transform, opacity' as a static CSS prop on children.
 */
export const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/**
 * Image animation (slide in left).
 * NOTE: Add will-change: 'transform, opacity' as a static CSS/inline style
 * on the element itself — not here — so the browser promotes it to its
 * own layer before animation begins.
 */
export const imageVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 },
  },
};

/**
 * Content (slide in right)
 */
export const contentVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

/**
 * Generic text (fade up)
 */
export const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

/**
 * Headline (slightly stronger entrance)
 * Spring controls timing — duration is ignored and has been removed.
 */
export const headlineVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

/**
 * Subtext (lighter fade up)
 * Spring controls timing — duration is ignored and has been removed.
 */
export const subtextVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

/**
 * Button animation
 * Spring controls timing — duration is ignored and has been removed.
 */
export const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
    },
  },
};

/**
 * Card animation — entrance only, no entrance scale.
 * Scale is reserved for the hover state to avoid subpixel rendering
 * artifacts on text-heavy cards during page load.
 */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    y: -6,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Simple fade up (utility)
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Line reveal (scaleX)
 */
export const lineRevealVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Hover overlay (clipPath slide-in).
 * Self-contained — no overflow: hidden required on the parent,
 * unlike the previous x: '-100%' approach.
 */
export const hoverVariants: Variants = {
  rest: { clipPath: 'inset(0 100% 0 0)' },
  hover: {
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

/**
 * Stats / metrics animation — no entrance scale.
 */
export const statVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const categoryVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const ctaVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

/**
 * Item animation — no entrance scale to avoid subpixel jank.
 */
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

/**
 * Icon hover animation — subtle single-direction rotation
 * suited to a professional fintech context.
 */
export const iconVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.95,
  },
};
