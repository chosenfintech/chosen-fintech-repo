// src/components/posts/detail/Header.tsx
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { IPost } from "@/types/posts/post.types";

interface HeaderProps {
  post: IPost;
}

export const Header: React.FC<HeaderProps> = ({ post }) => {
  return (
    <div className="w-full min-w-0">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 lg:mb-12"
      >
        <div className="mb-6">
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-0 rounded-full"
          >
            {post.category?.name || "Article"}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight wrap-break-word">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed w-full wrap-break-word">
            {post.excerpt}
          </p>
        )}
      </motion.div>

      {/* Cover Image */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-8 lg:mb-12 w-full"
        >
          <div className="aspect-video overflow-hidden rounded-lg border relative group w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={675}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-101"
              priority
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};
