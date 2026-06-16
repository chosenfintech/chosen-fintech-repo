// src/components/projects/detail/DetailClient.tsx
'use client';

import React from 'react';
import { IProject } from '@/types/projects/project.types';
import { Header } from './Header';
import { ProjectContent } from './Content';
import { ShareMenu } from './ShareMenu';

interface IBlogProjectDetailClientProps {
  project: IProject;
}

const BlogProjectDetailClient: React.FC<IBlogProjectDetailClientProps> = ({
  project,
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
                <ShareMenu projectTitle={project.title} />
              </div>
            </div>

            {/* Main reading column */}
            <article className="w-full min-w-0">
              <Header project={project} />
              <ProjectContent content={project.content} />
            </article>
          </div>
        </div>

        {/* Mobile sticky share bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-3">
          <ShareMenu projectTitle={project.title} />
        </div>
      </main>
    </div>
  );
};

export default BlogProjectDetailClient;
