'use client';

import { PageHero } from '@/components/ui/PageHero';
import { motion } from 'motion/react';
import { containerVariants, itemVariants } from '@/static-data/motion-variants';
import { contactInfo } from '@/static-data/contact';

export default function ContactPageClient() {
  return (
    <div className="flex-1">
      <PageHero title="Contact Us" />

      {/* Contact Info Section */}
      <section className="py-16 lg:py-24">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-6 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {contactInfo.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className={`flex items-start gap-4 md:gap-5 ${
                  item.label === 'Address' ? 'md:col-span-2 xl:col-span-1' : ''
                }`}
              >
                {/* Icon */}
                <div className="group/icon shrink-0 w-12 h-12 md:w-14 md:h-14 cursor-pointer bg-primary flex items-center justify-center transition-colors duration-300 hover:bg-background hover:outline hover:outline-primary hover:animate-shake">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground transition-colors duration-300 group-hover/icon:text-primary" />
                </div>

                <div className="min-w-0 pt-1">
                  {/* Label */}
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    {item.label}
                  </h3>

                  {/* Value */}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-display text-base lg:text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-display text-base lg:text-lg font-medium text-foreground break-words">
                      {item.value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
