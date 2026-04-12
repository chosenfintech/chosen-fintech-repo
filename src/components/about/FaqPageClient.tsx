// src/components/about/FaqPageClient.tsx
'use client';

import { PageHero } from '@/components/ui/PageHero';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  containerVariants,
  categoryVariants,
  ctaVariants,
} from '@/static-data/motion-variants';
import { faqCategories } from '@/static-data/about';

export default function FaqPageClient() {
  return (
    <div>
      <PageHero title="FAQ" />

      {/* FAQ Content */}
      <section className="py-16 lg:py-24">
        <div className="w-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-12 lg:space-y-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {faqCategories.map((category, categoryIndex) => (
              <motion.div key={category.category} variants={categoryVariants}>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6 lg:mb-8">
                  {category.category}
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="space-y-3 lg:space-y-4"
                >
                  {category.questions.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 100,
                        damping: 15,
                      }}
                    >
                      <AccordionItem
                        value={`${categoryIndex}-${index}`}
                        className="bg-card rounded-xl border px-5 sm:px-6 lg:px-8 card-shadow hover:shadow-lg transition-shadow duration-300"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline py-4 sm:py-5 text-sm sm:text-base">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-4 sm:pb-5 text-sm sm:text-base">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="w-full mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={ctaVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Still Have Questions?
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-base sm:text-lg mb-8 lg:mb-10 max-w-xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Can&apos;t find the answer you&apos;re looking for? Our team is
              here to help.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button asChild size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
