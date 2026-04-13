'use client';

import { PageHero } from '@/components/ui/PageHero';
import { motion } from 'motion/react';
import { containerVariants, itemVariants } from '@/static-data/motion-variants';
import { contactInfo } from '@/static-data/contact';

export default function ContactPageClient() {
  return (
    <div>
      <PageHero title="Contact Us" />

      {/* Contact Info Section */}
      <section className="py-16 lg:py-24">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {contactInfo.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="group flex flex-col items-center text-center p-6 md:p-0 rounded-2xl border border-border bg-card shadow-sm md:border-none md:bg-transparent md:shadow-none"
              >
                {/* Icon */}
                <div className="mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 cursor-pointer rounded-xl bg-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-background group-hover:outline group-hover:outline-primary group-hover:animate-shake">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-primary-foreground transition-colors duration-300 group-hover:text-primary" />
                  </div>
                </div>

                {/* Label */}
                <h3 className="font-display text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-3">
                  {item.label}
                </h3>

                {/* Value */}
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm lg:text-base"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-muted-foreground text-sm lg:text-base">
                    {item.value}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
