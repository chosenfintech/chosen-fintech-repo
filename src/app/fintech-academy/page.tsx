// app/cardano-hub/page.tsx
'use client';
import { useState } from 'react';
import { PageHero } from '@/components/sections/PageHero';
import { EducationalGuides } from '@/components/cardano/EducationalGuides';
import { UpdatesList } from '@/components/cardano/UpdatesList';
import { UpdatesSidebar } from '@/components/cardano/UpdatesSidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, Variants } from 'motion/react';
import {
  Wallet,
  Coins,
  Vote,
  Code,
  Shield,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

const guides = [
  {
    icon: Wallet,
    title: 'Getting Started with Cardano',
    description:
      'Learn the basics: what is Cardano, how to set up a wallet, and buy your first ADA.',
    level: 'Beginner' as const,
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    link: '#',
  },
  {
    icon: Coins,
    title: 'Staking & Delegation',
    description:
      'Understand how to stake your ADA, choose stake pools, and earn passive rewards.',
    level: 'Beginner' as const,
    image:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
    link: '#',
  },
  {
    icon: Vote,
    title: 'Project Catalyst & Governance',
    description:
      "Participate in Cardano's decentralized governance and vote on funding proposals.",
    level: 'Intermediate' as const,
    image:
      'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80',
    link: '#',
  },
  {
    icon: Code,
    title: 'Smart Contracts on Cardano',
    description:
      'Introduction to Plutus and Marlowe for building decentralized applications.',
    level: 'Advanced' as const,
    image:
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80',
    link: '#',
  },
  {
    icon: Shield,
    title: 'NFTs on Cardano',
    description:
      'Explore the native NFT ecosystem, marketplaces, and how to mint your own NFTs.',
    level: 'Intermediate' as const,
    image:
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
    link: '#',
  },
  {
    icon: BookOpen,
    title: 'DeFi on Cardano',
    description:
      'Navigate DEXs, lending protocols, and yield opportunities in the Cardano ecosystem.',
    level: 'Intermediate' as const,
    image:
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80',
    link: '#',
  },
];

const updates = [
  {
    id: 1,
    title: 'Chang Hard Fork Successfully Deployed',
    date: 'Jan 6, 2026',
    excerpt:
      "The Chang hard fork marks a major milestone in Cardano's governance evolution with on-chain voting capabilities now live.",
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
  },
  {
    id: 2,
    title: 'Midnight Sidechain Testnet Launch',
    date: 'Jan 2, 2026',
    excerpt:
      "Input Output Global announces the public testnet for Midnight, Cardano's privacy-focused sidechain with exciting new features.",
    image:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
  },
  {
    id: 3,
    title: 'ADA Staking Rewards Update',
    date: 'Dec 28, 2025',
    excerpt:
      'Current epoch staking parameters and analysis of stake pool performance metrics across the network.',
    image:
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80',
  },
  {
    id: 4,
    title: 'New Plutus V3 Features Released',
    date: 'Dec 20, 2025',
    excerpt:
      'Enhanced smart contract capabilities with improved performance and new functionality for developers.',
    image:
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
  },
];

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

const FintechAcademy = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUpdates = updates.filter(
    (update) =>
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const recentUpdates = updates.slice(0, 3).map((update) => ({
    id: update.id,
    title: update.title,
    date: update.date,
    image: update.image,
  }));

  return (
    <div className="min-h-screen">
      <NavBar />
      <PageHero title="Fintech Academy" />

      {/* Educational Guides */}
      <EducationalGuides guides={guides} />

      {/* Ecosystem Updates */}
      <section className="py-12 lg:py-16 xl:py-20 bg-muted/30">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                FINTECH ECOSYSTEM UPDATES
              </h2>
            </div>
            <motion.div initial="rest" whileHover="hover">
              <Button
                variant="outline"
                className="relative z-10 w-fit border-2 border-primary/30 text-foreground backdrop-blur-sm h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium overflow-hidden group transition-colors duration-300"
                asChild
              >
                <Link href="/blog" className="flex items-center justify-center">
                  <span className="relative z-20 group-hover:text-primary-foreground transition-colors duration-300">
                    View All Updates
                    <ArrowRight className="ml-2 w-4 h-4 inline transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-primary rounded-full z-10"
                    variants={hoverVariants}
                  />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Grid Layout */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Main Content */}
            <div className="lg:col-span-8">
              <UpdatesList updates={filteredUpdates} />
            </div>

            {/* Sidebar */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="lg:sticky lg:top-24">
                <UpdatesSidebar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  recentUpdates={recentUpdates}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center bg-primary rounded-3xl p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Dive Into Cardano?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join our community of learners and start your journey into the
                Cardano ecosystem today.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">Get Started Now</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FintechAcademy;
