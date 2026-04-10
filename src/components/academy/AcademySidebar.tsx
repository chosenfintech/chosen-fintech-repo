// src/components/academy/AcademySidebar.tsx
'use client';

import * as React from 'react';
import { Search, X, Calendar, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { IPost } from '@/types/posts/post.types';

interface AcademySidebarProps {
  recentPosts: IPost[];
  searchQuery?: string;
  onSearch: (query: string) => void;
}

interface AcademySidebarProps {
  recentPosts: IPost[];
  searchQuery?: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}

export const AcademySidebar = ({
  recentPosts,
  searchQuery,
  onSearch,
  onClearSearch,
}: AcademySidebarProps) => {
  const [localSearch, setLocalSearch] = React.useState(searchQuery || '');
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => onSearch(value), 400);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    onClearSearch();
  };

  return (
    <aside className="space-y-6 lg:space-y-8">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -2 }}
      >
        <Card className="border-border/50 p-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-5 lg:p-6">
            <h3 className="font-display text-base lg:text-lg font-semibold mb-4 text-foreground">
              Search Posts
            </h3>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={18}
              />
              <Input
                type="search"
                placeholder="Search posts..."
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary transition-colors"
              />
              {localSearch && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <Button
                variant="link"
                size="sm"
                className="mt-2 p-0 h-auto text-xs text-muted-foreground"
                onClick={handleClearSearch}
              >
                Clear search
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ y: -2 }}
        >
          <Card className="border-border/50 p-0 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-5 lg:p-6">
              <h3 className="font-display text-base lg:text-lg font-semibold mb-5 text-foreground">
                Recent Posts
              </h3>
              <div className="space-y-5">
                {recentPosts.map((post, index) => {
                  const formattedDate = post.publishDate
                    ? new Date(post.publishDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : null;

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.08 }}
                      whileHover={{ x: 4 }}
                    >
                      <Link
                        href={`/academy/${post.slug}`}
                        className="flex gap-3 group cursor-pointer"
                      >
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden ring-1 ring-border/50 group-hover:ring-primary/50 transition-all duration-300 bg-muted">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2 leading-snug">
                            {post.title}
                          </h4>
                          {formattedDate && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar size={12} />
                              {formattedDate}
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </aside>
  );
};