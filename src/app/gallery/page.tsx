// src/app/gallery/page.tsx
'use client';

import { PageHero } from '@/components/sections/PageHero';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

const Gallery = () => {
  return (
    <div>
      <NavBar />
      <PageHero title="Gallery" />
      <div className="py-24">Gallery Display</div>
      <Footer />
    </div>
  );
};

export default Gallery;
