// src/app/dashboard/gallery/photos/page.tsx
import { Suspense } from 'react';
import GalleryPhotosManageClient from './_components/GalleryPhotosManageClient';
import { GridSkeleton } from '@/components/gallery/photos/grid/GridSkeleton';

const GalleryPhotosManagePage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto">
          <GridSkeleton count={24} />
        </div>
      }
    >
      <GalleryPhotosManageClient />
    </Suspense>
  );
};

export default GalleryPhotosManagePage;
