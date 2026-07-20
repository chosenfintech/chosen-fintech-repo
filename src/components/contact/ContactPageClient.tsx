'use client';

import { motion } from 'motion/react';
import { PageHero } from '@/components/ui/PageHero';
import { fadeUpVariants } from '@/static-data/motion-variants';
import { ContactForm } from './ContactForm';
import { ContactDirectory } from './ContactDirectory';
import { LocationMap } from './LocationMap';

export default function ContactPageClient() {
  return (
    <div className="flex-1">
      <PageHero title="Contact Us" />

      {/* One band, held to the same max width as every other page section:
          the message on the left, the office on the right. */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 border border-border lg:grid-cols-[1.05fr_0.95fr]">
            {/* Message. White in light mode, deep navy in dark. */}
            <div className="bg-background px-6 py-12 sm:px-10 sm:py-14 lg:px-14 dark:bg-[oklch(0.24_0.07_264)]">
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mx-auto w-full max-w-xl lg:mx-0"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  Get in touch
                </p>

                <h2 className="mt-5 text-3xl font-bold uppercase leading-[1.1] text-primary sm:text-4xl dark:text-white">
                  Let&rsquo;s talk about
                  <br />
                  your next step
                </h2>

                <div className="mt-6 h-0.5 w-12 bg-primary dark:bg-white/70" />

                <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                  Whether you are learning, partnering, or need a hand with
                  something, tell us what you need and the right person will
                  come back to you.
                </p>

                <div className="mt-10">
                  <ContactForm />
                </div>
              </motion.div>
            </div>

            {/* Office */}
            <div className="flex flex-col border-t border-border bg-card lg:border-l lg:border-t-0">
              <LocationMap className="lg:flex-1" />
              <ContactDirectory />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
