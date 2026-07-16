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
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  containerVariants,
  categoryVariants,
  fadeUpVariants,
  lineRevealVariants,
  hoverVariants,
  textVariants,
} from '@/static-data/motion-variants';
import { faqCategories } from '@/static-data/about';

export default function FaqPageClient() {
  return (
    <div>
      <PageHero title="FAQ" />

      {/* FAQ Content */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="relative py-16 md:py-24 bg-muted/30"
      >
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-16 lg:space-y-24"
            variants={containerVariants}
          >
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                variants={categoryVariants}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
              >
                {/* Left sticky label */}
                <motion.div
                  variants={fadeUpVariants}
                  className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start"
                >
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-primary dark:text-foreground leading-tight">
                    {category.category.split(' ').map((word) => (
                      <span key={word}>
                        {word}
                        <br />
                      </span>
                    ))}
                  </h2>
                  <motion.div
                    variants={lineRevealVariants}
                    className="w-10 h-0.5 bg-primary dark:bg-foreground mt-4 origin-left"
                  />
                </motion.div>

                {/* Right accordion */}
                <div className="lg:col-span-9">
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
                          delay: index * 0.08,
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                        }}
                      >
                        <AccordionItem
                          value={`${categoryIndex}-${index}`}
                          className="bg-card border border-border hover:border-border hover:border-primary rounded-[5px] px-5 sm:px-6 lg:px-8 overflow-hidden transition-shadow duration-300 hover:shadow-sm hover:shadow-black/10"
                        >
                          <AccordionTrigger className="text-left  cursor-pointer  font-medium hover:no-underline py-4 sm:py-5 text-sm sm:text-base text-foreground data-[state=open]:text-primary transition-colors duration-200">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pb-4 sm:pb-5 text-sm sm:text-base">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Still Have Questions */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="relative py-16 md:py-24 bg-muted/20 border-t border-border/50"
      >
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={fadeUpVariants}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-foreground"
          >
            STILL HAVE QUESTIONS?
          </motion.h2>

          <motion.div
            variants={lineRevealVariants}
            className="w-10 h-0.5 bg-primary dark:bg-foreground mx-auto mt-4 mb-6 origin-center"
          />

          <motion.p
            variants={fadeUpVariants}
            className="text-muted-foreground text-base sm:text-lg mb-10 max-w-xl mx-auto"
          >
            Can&apos;t find the answer you&apos;re looking for? Our team is here
            to help.
          </motion.p>

          <motion.div variants={textVariants} initial="rest" whileHover="hover">
            <Button
              variant="outline"
              size="lg"
              className="relative z-10 border-2 border-border dark:border-white text-foreground rounded-full backdrop-blur-sm h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium overflow-hidden group transition-colors duration-300"
              asChild
            >
              <Link
                href="/contact"
                className="flex items-center justify-center"
              >
                <span className="relative z-20 group-hover:text-primary-foreground dark:group-hover:text-[oklch(0.396_0.195_264)] transition-colors duration-300">
                  Contact Us
                  <ArrowRight className="ml-2 w-4 h-4 inline transition-transform group-hover:translate-x-1" />
                </span>
                <motion.span
                  className="absolute inset-0 bg-primary dark:bg-white rounded-full z-10"
                  variants={hoverVariants}
                />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
