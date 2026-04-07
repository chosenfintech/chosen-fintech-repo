// app/blog/page.tsx
'use client';
import { useState } from 'react';
import { PageHero } from '@/components/PageHero';
import { BlogList } from '@/components/blog/BlogList';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { motion } from 'motion/react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

const categories = ['All', 'Cardano', 'DeFi', 'Security', 'Guides', 'News'];

const blogPosts = [
  {
    id: 1,
    title: "Understanding Cardano's Proof of Stake: A Beginner's Guide",
    excerpt:
      "Learn how Cardano's Ouroboros protocol works and why it's more sustainable than traditional proof of work systems.",
    category: 'Cardano',
    date: 'Jan 5, 2026',
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    title: 'DeFi Fundamentals: Navigating Decentralized Finance',
    excerpt:
      'A comprehensive introduction to DeFi concepts, protocols, and how to safely participate in the ecosystem.',
    category: 'DeFi',
    date: 'Jan 3, 2026',
    image:
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    title: 'Crypto Security Best Practices for 2026',
    excerpt:
      'Essential security tips to protect your digital assets and navigate the crypto space safely.',
    category: 'Security',
    date: 'Dec 28, 2025',
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    title: 'How to Stake ADA: A Complete Guide',
    excerpt:
      'Step-by-step instructions for staking your Cardano ADA tokens and earning rewards.',
    category: 'Guides',
    date: 'Dec 22, 2025',
    image:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 5,
    title: 'The Future of Smart Contracts on Cardano',
    excerpt:
      'Exploring Plutus, Marlowe, and the evolving landscape of smart contracts in the Cardano ecosystem.',
    category: 'Cardano',
    date: 'Dec 18, 2025',
    image:
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 6,
    title: 'Understanding Tokenomics: A Practical Guide',
    excerpt:
      'What makes a cryptocurrency valuable? Learn to analyze tokenomics and make informed decisions.',
    category: 'Guides',
    date: 'Dec 15, 2025',
    image:
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&auto=format&fit=crop&q=60',
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recentPosts = blogPosts.slice(0, 3).map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date,
    image: post.image,
  }));

  return (
    <div className="min-h-screen">
      <NavBar />
      <PageHero title="Blog" />

      <section className="py-12 lg:py-16 xl:py-20 bg-muted/30">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Mobile Search + Filter */}
              <motion.div
                className="lg:hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <BlogSidebar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  recentPosts={recentPosts}
                />
              </motion.div>

              <BlogList posts={filteredPosts} />
            </div>

            {/* Desktop Sidebar */}
            <motion.div
              className="hidden lg:block lg:col-span-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="lg:sticky lg:top-24 space-y-6">
                <BlogSidebar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  recentPosts={recentPosts}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
