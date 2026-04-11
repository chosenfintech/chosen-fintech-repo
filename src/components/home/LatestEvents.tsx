// src/components/home/LatestEvents.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  cardVariants,
  containerVariants,
  fadeUpVariants,
  hoverVariants,
  lineRevealVariants,
  textVariants,
} from '@/static-data/motion-variants';
import { IPost } from '@/types/posts/post.types';

interface LatestEventsProps {
  posts: IPost[];
}

function formatDate(post: IPost): string {
  const date = post.publishDate ?? post.createdAt;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function LatestEvents({ posts }: LatestEventsProps) {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
          >
            <motion.div variants={fadeUpVariants} className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                LATEST EVENTS
              </h2>
              <motion.div
                variants={lineRevealVariants}
                className="w-10 h-0.5 bg-primary mt-4 origin-left"
              />
              <p className="text-muted-foreground mt-3 md:block">
                Stay informed about our latest community events, meetups, and
                activities.
              </p>
            </motion.div>
            <motion.div
              variants={textVariants}
              initial="rest"
              whileHover="hover"
            >
              <Button
                variant="outline"
                size="lg"
                className="relative z-10 border-2 border-primary/30 text-foreground rounded-full backdrop-blur-sm h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium overflow-hidden group transition-colors duration-300"
                asChild
              >
                <Link
                  href="/events"
                  className="flex items-center justify-center"
                >
                  <span className="relative z-20 group-hover:text-primary-foreground transition-colors duration-300">
                    See All Events
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

          {/* Empty State */}
          {posts.length === 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUpVariants}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                No events at the moment
              </p>
              <p className="text-sm text-muted-foreground">
                Check back later for upcoming events and activities.
              </p>
            </motion.div>
          ) : (
            /* Event Cards Grid */
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {posts.map((post, index) => (
                <motion.div key={post.id} variants={cardVariants}>
                  <Link
                    href={`/events/${post.slug}`}
                    className="group block h-full"
                  >
                    <Card className="overflow-hidden border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col p-0">
                      {/* Image Container */}
                      <div className="relative aspect-16/10 overflow-hidden bg-muted">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index === 0}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <Calendar className="w-10 h-10 text-muted-foreground" />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <CardContent className="p-6 flex-1 flex flex-col">
                        {/* Meta Information */}
                        <div className="flex items-center gap-3 mb-4">
                          {post.category && (
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wide">
                              {post.category.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
                          {post.excerpt}
                        </p>

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300">
                          Read More
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
