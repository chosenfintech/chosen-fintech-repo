// src/app/gallery/page.tsx
'use client';

import { PageHero } from '@/components/ui/PageHero';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { ImageOff } from 'lucide-react';

const Gallery = () => {
  return (
    <div>
      <NavBar />
      <PageHero title="Gallery" />

      <div className="py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm px-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <ImageOff
              className="w-7 h-7 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              No photos yet
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We&apos;re putting together something worth seeing. Check back
              soon.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Gallery;
