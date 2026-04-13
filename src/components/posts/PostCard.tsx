// src/components/posts/PostCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IPost } from '@/types/posts/post.types';
import { motion, Variants } from 'motion/react';

interface BlogPostCardProps {
  post: IPost;
}

const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.7, ease: 'easeOut' } },
};

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const formattedDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="group overflow-hidden p-0 border-border/50 hover:border-primary/50 hover:shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:grid sm:grid-cols-5 gap-0">
          {/* Image Section */}
          <motion.div
            className="sm:col-span-2 relative w-full aspect-[16/9] sm:aspect-auto sm:min-h-[200px] overflow-hidden bg-muted"
            variants={imageVariants}
            initial="rest"
            whileHover="hover"
          >
            {post.coverImage ? (
              <>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 min-h-[180px]">
                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
              </div>
            )}
          </motion.div>

          {/* Content Section */}
          <CardContent className="sm:col-span-3 p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col justify-center gap-3 sm:gap-4">
            {post.category?.name && (
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="w-4 h-px bg-primary" />
                {post.category.name}
              </span>
            )}

            {/* Title */}
            <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Date + Read More */}
            <div className="flex items-center justify-between">
              {formattedDate && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Calendar size={12} strokeWidth={2} />
                  {formattedDate}
                </span>
              )}
              <Button
                variant="link"
                className="p-0 h-auto group/btn text-xs sm:text-sm font-semibold ml-auto"
              >
                Read More
                <ArrowRight className="ml-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
