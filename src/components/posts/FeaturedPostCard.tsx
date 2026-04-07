// src/components/blog/FeaturedPostCard.tsx
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Calendar,
  ArrowRight,
  Clock,
  ImageIcon,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { IPost } from '@/types/posts/post.types';
import { format } from 'date-fns';

interface IFeaturedPostCardProps {
  post: IPost;
}

export default function FeaturedPostCard({ post }: IFeaturedPostCardProps) {
  return (
    <div className="cursor-pointer">
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden p-0 shadow-none group bg-card text-card-foreground relative">
          {/* Featured Badge - Top Right Corner */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-brand-orange text-white shadow-lg border-0 px-3 py-1 flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-semibold text-xs">Featured</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[400px] lg:min-h-[450px]">
            {/* Image Section */}
            <div className="relative aspect-16/10 md:aspect-auto overflow-hidden bg-muted">
              {post.coverImage ? (
                <div className="w-full h-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-101 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted/50">
                  <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <CardContent className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              {/* Category and Date */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category?.name && (
                  <div className="w-fit px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:scale-105 transition-transform">
                    {post.category.name}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {post.publishDate
                      ? format(new Date(post.publishDate), 'MMM d, yyyy')
                      : '—'}
                  </span>{' '}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight text-foreground line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm md:text-base leading-relaxed mb-6 text-muted-foreground line-clamp-3 grow-0">
                {post.excerpt}
              </p>

              {/* Bottom Metadata Section */}
              <div className="mt-auto">
                {/* Author and Read Time */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-xs text-foreground truncate max-w-[120px]">
                      {post.author.fullname}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground border-l pl-4 border-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Engagement and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-muted/50">
                  <div className="hover:scale-105 active:scale-95 transition-transform">
                    <Button
                      size="sm"
                      className="group/btn shadow-lg bg-brand-orange text-primary-foreground hover:bg-brand-red transition-colors"
                    >
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    </div>
  );
}
