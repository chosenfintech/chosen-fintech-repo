// src/components/contact/ContactDirectory.tsx
'use client';

import { motion } from 'motion/react';
import { containerVariants, itemVariants } from '@/static-data/motion-variants';
import { contactInfo } from '@/static-data/contact';

/**
 * The office details as a hairline-ruled directory rather than a row of cards,
 * so it reads as a continuation of the map panel it sits under.
 */
export function ContactDirectory() {
  return (
    <motion.dl
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="divide-y divide-border border-t border-border"
    >
      {contactInfo.map((item) => (
        <motion.div
          key={item.label}
          variants={itemVariants}
          className="group flex items-start gap-4 px-6 py-5 transition-colors duration-300 hover:bg-muted/40 sm:gap-6 sm:px-8 lg:px-10"
        >
          <item.icon
            strokeWidth={1.5}
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          />

          <div className="min-w-0 flex-1">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1.5 text-sm font-medium leading-relaxed text-foreground sm:text-base">
              {item.href ? (
                <a
                  href={item.href}
                  className="break-words transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {item.value}
                </a>
              ) : (
                <span className="break-words">{item.value}</span>
              )}
            </dd>
          </div>
        </motion.div>
      ))}
    </motion.dl>
  );
}
