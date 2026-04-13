// src/components/posts/detail/Header.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IPost } from '@/types/posts/post.types';
import { AuthorMetaCard } from './AuthorMetaCard';

interface HeaderProps {
  post: IPost;
}

export const Header: React.FC<HeaderProps> = ({ post }) => {
  return (
    <header className="w-full mb-10">
      {/* Category */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-5"
      >
        {post.category?.name && (
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="w-4 h-px bg-primary" />
            {post.category.name}
          </span>
        )}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.15] tracking-tight mb-5 break-words"
      >
        {post.title}
      </motion.h1>

      {/* Excerpt */}
      {post.excerpt && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed mb-6 break-words"
        >
          {post.excerpt}
        </motion.p>
      )}

      {/* Byline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <AuthorMetaCard post={post} />
      </motion.div>

      {/* Cover image */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 w-full"
        >
          <div className="aspect-[16/9] overflow-hidden rounded-xl border border-border w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={675}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      )}
    </header>
  );
};
