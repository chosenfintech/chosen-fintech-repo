// src/components/posts/detail/DetailClient.tsx
'use client';
import React from 'react';
import { IPost } from '@/types/posts/post.types';
import { AuthorMetaCard } from './AuthorMetaCard';
import { Header } from './Header';
import { PostContent } from './Content';
import { ShareMenu } from './ShareMenu';

interface IBlogPostDetailClientProps {
  post: IPost;
}

const BlogPostDetailClient: React.FC<IBlogPostDetailClientProps> = ({
  post,
}) => {
  return (
    <div className="min-h-screen ">
      <main className="container mx-auto max-w-6xl px-4 py-12 lg:py-24 w-full">
        {/* Main Layout Grid */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 w-full">
          {/* Main Content Column */}
          <div className="lg:col-start-1 min-w-0 w-full">
            <Header post={post} />

            {/* Meta Card - Mobile/Tablet Only */}
            <div className="mb-8 lg:hidden">
              <AuthorMetaCard post={post} />
            </div>

            {/* Post Content with Tags */}
            <PostContent content={post.content} />

            {/* Action Buttons - Mobile/Tablet */}
            <div className="sticky top-20 mb-8 lg:hidden mt-6">
              <div className="w-full md:w-1/2">
                <ShareMenu postTitle={post.title} />
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-start-2">
            <div className="sticky top-35 flex flex-col gap-6">
              <AuthorMetaCard post={post} />
              <ShareMenu postTitle={post.title} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPostDetailClient;
