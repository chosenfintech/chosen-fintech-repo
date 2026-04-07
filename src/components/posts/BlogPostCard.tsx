// src/components/posts/BlogPostCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Clock, ArrowRight, Calendar, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { IPost } from '@/types/posts/post.types';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: IPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div key={post.id} className="group cursor-pointer ">
      <Link href={`/blog/${post.slug}`}>
        <Card className="relative border-border p-0  transition-shadow duration-500 overflow-hidden group h-full">
          <CardContent className="p-0">
            {/* Image Section */}
            <div className="aspect-4/3 overflow-hidden relative bg-muted">
              {post.coverImage ? (
                <div className="h-full w-full hover:scale-101 transition-transform duration-500">
                  <Image
                    width={400}
                    height={300}
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-muted to-muted/50">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 relative">
              {post.category?.name && (
                <div className="w-fit mb-3 px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:scale-105 transition-transform">
                  {post.category.name}
                </div>
              )}

              {/* Title */}
              <h3 className="font-serif text-xl font-bold mb-3 leading-tight line-clamp-2 text-foreground hover:text-brand-red transition-colors duration-300">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="leading-relaxed mb-4 line-clamp-3 text-muted-foreground">
                {post.excerpt}
              </p>

              {/* Author and Read Time */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-muted-foreground" />
                    </div>

                    <span className="text-muted-foreground truncate">
                      {post.author.fullname}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer with Date and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {post.publishDate
                      ? format(new Date(post.publishDate), 'MMM d, yyyy')
                      : '—'}
                  </span>
                </div>

                <div className="hover:scale-105 active:scale-95 transition-transform">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group/btn p-0 h-auto font-medium text-sm text-brand-orange hover:text-brand-red transition-colors"
                  >
                    Read Article
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
