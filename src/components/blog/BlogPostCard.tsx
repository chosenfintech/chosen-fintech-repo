// components/blog/BlogPostCard.tsx
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
    <Link href={`/blog/${post.slug}`}>
      <Card className="group overflow-hidden p-0 border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Image Section */}
          <motion.div
            className="md:col-span-2 relative aspect-video md:aspect-auto md:h-full overflow-hidden bg-muted"
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
                  className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 min-h-[160px]">
                <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
          </motion.div>

          {/* Content Section */}
          <CardContent className="md:col-span-3 p-6 lg:p-8 xl:p-10 flex flex-col justify-center">
            {/* Meta Info */}
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {post.category?.name && (
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                  {post.category.name}
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Calendar size={13} strokeWidth={2} />
                  {formattedDate}
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h3
              className="font-display text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-3 lg:mb-4 group-hover:text-primary transition-colors duration-300 leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {post.title}
            </motion.h3>

            {/* Excerpt */}
            <motion.p
              className="text-sm lg:text-base text-muted-foreground line-clamp-2 lg:line-clamp-3 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {post.excerpt}
            </motion.p>

            {/* Read More */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Button
                variant="link"
                className="p-0 h-auto self-start group/btn text-sm lg:text-base font-semibold"
              >
                Read More
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
              </Button>
            </motion.div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
