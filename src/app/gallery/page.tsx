// src/app/gallery/page.tsx
'use client';

import { PageHero } from '@/components/PageHero';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

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
