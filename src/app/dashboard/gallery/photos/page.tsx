// src/app/dashboard/gallery/photos/page.tsx
import { Suspense } from 'react';
import GalleryPhotosManageClient from './_components/GalleryPhotosManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const GalleryPhotosManagePage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto">
          <DataTableSkeleton
            columnCount={6}
            rowCount={10}
            showFilters={true}
            showActions={true}
            showPagination={true}
          />
        </div>
      }
    >
      <GalleryPhotosManageClient />
    </Suspense>
  );
};

export default GalleryPhotosManagePage;
