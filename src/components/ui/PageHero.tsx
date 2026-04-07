// src/components/ui/PageHero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home, MoveRight } from 'lucide-react';

interface PageHeroProps {
  title: string;
}

export function PageHero({ title }: PageHeroProps) {
  return (
    <section className="relative pb-6 pt-24 sm:pb-16 sm:pt-32 md:pb-16 md:pt-48 lg:pb-16 lg:pt-48 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={'/hero-bg.jpg'}
          alt="background image for heros"
          className="w-full h-full object-cover"
          fill
        />
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground pt-4 sm:pt-6 md:pt-0 mb-4 sm:mb-5 md:mb-6 uppercase tracking-wide animate-fade-in">
            {title}
          </h1>

          <div
            className="flex items-center justify-center gap-2 sm:gap-3 text-primary-foreground/80 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <Link
              href="/"
              className="hover:text-primary-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <MoveRight strokeWidth={0.5} className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">{title}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
