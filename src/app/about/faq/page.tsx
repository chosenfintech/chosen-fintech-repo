// src/app/about/faq/page.tsx
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
import { motion, Variants } from 'motion/react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

const faqCategories = [
  {
    category: 'About Chosen Fintech',
    questions: [
      {
        q: 'What is Chosen Fintech?',
        a: 'Chosen Fintech is a fintech education agency dedicated to cryptocurrency and blockchain education. We specialize in the Cardano ecosystem while also covering broader topics in DeFi, financial literacy, and digital asset management.',
      },
      {
        q: 'Why do you focus on Cardano?',
        a: 'We focus on Cardano because of its scientific, peer-reviewed approach to blockchain development, its commitment to sustainability through proof-of-stake, and its mission to provide financial services to the underbanked. Cardano represents the values we believe in: rigorous research, security, and real-world impact.',
      },
      {
        q: 'Who are your programs designed for?',
        a: 'Our programs cater to everyone from complete beginners curious about cryptocurrency to developers wanting to build on Cardano. We offer different learning paths based on experience level and goals.',
      },
    ],
  },
  {
    category: 'Cryptocurrency & Blockchain',
    questions: [
      {
        q: 'What is cryptocurrency?',
        a: 'Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies issued by governments, cryptocurrencies operate on decentralized networks using blockchain technology.',
      },
      {
        q: 'What is blockchain technology?',
        a: "Blockchain is a distributed ledger technology that records transactions across many computers in a way that makes the records difficult to alter. Each 'block' contains transaction data and is linked to the previous block, forming a 'chain' of transparent, immutable records.",
      },
      {
        q: 'Is cryptocurrency safe to invest in?',
        a: 'Cryptocurrency investments carry significant risks including volatility, regulatory uncertainty, and security concerns. We encourage thorough research and education before investing. Our programs focus on education, not investment advice—we help you understand the technology so you can make informed decisions.',
      },
    ],
  },
  {
    category: 'Cardano Specific',
    questions: [
      {
        q: 'What is ADA?',
        a: "ADA is the native cryptocurrency of the Cardano blockchain. It's named after Ada Lovelace, a 19th-century mathematician considered to be the first computer programmer. ADA is used for transactions, staking, and governance on the Cardano network.",
      },
      {
        q: 'How do I stake my ADA?',
        a: 'Staking ADA involves delegating your tokens to a stake pool, which helps secure the network while earning you rewards. You maintain full control of your ADA—it never leaves your wallet. We offer comprehensive guides on how to stake through our Cardano Hub.',
      },
      {
        q: 'What is Project Catalyst?',
        a: "Project Catalyst is Cardano's community-driven innovation fund. ADA holders can submit proposals for projects, vote on proposals, and help guide the development of the Cardano ecosystem. It's one of the largest decentralized innovation funds in the world.",
      },
    ],
  },
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I start learning about crypto?',
        a: 'Start with our beginner resources in the Cardano Hub or Blog sections. We recommend beginning with foundational concepts before diving into specific technologies. Our learning paths are designed to guide you step-by-step.',
      },
      {
        q: 'Do I need any technical background?',
        a: 'Not at all! Our beginner programs are designed for people with no prior technical or financial background. We break down complex concepts into digestible, easy-to-understand content.',
      },
      {
        q: 'How can I get involved with Chosen Fintech?',
        a: 'There are many ways to get involved: follow our blog and social media, attend our workshops, join our community events, or reach out through our contact page. We welcome everyone who shares our passion for financial education.',
      },
    ],
  },
];

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

const categoryVariants: Variants = {
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

const ctaVariants: Variants = {
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

const FAQ = () => {
  return (
    <div>
      <NavBar />
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
      <Footer />
    </div>
  );
};

export default FAQ;
