// src/components/guides/detail/DetailClient.tsx
'use client';

import React from 'react';
import { IGuide } from '@/types/guides/guide.types';
import { Header } from './Header';
import { GuideContent } from './Content';
import { ShareMenu } from './ShareMenu';

interface IBlogGuideDetailClientProps {
  guide: IGuide;
}

const BlogGuideDetailClient: React.FC<IBlogGuideDetailClientProps> = ({
  guide,
}) => {
  return (
    <div className="min-h-screen">
      <main className="w-full px-4 py-12 lg:py-20">
        {/* Centering wrapper — constrains total width to content + rail + gap */}
        <div className="mx-auto w-full max-w-[820px]">
          {/* Two-column: [48px rail] [content] */}
          <div className="lg:grid lg:grid-cols-[48px_1fr] lg:gap-x-10">
            {/* Desktop share rail */}
            <div className="hidden lg:flex justify-center pt-2">
              <div className="sticky top-32">
                <ShareMenu guideTitle={guide.title} />
              </div>
            </div>

            {/* Main reading column */}
            <article className="w-full min-w-0">
              <Header guide={guide} />
              <GuideContent content={guide.content} />
            </article>
          </div>
        </div>

        {/* Mobile sticky share bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-3">
          <ShareMenu guideTitle={guide.title} />
        </div>
      </main>
    </div>
  );
};

export default BlogGuideDetailClient;
