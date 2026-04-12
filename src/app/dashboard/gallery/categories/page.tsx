// src/app/dashboard/gallery/categories/page.tsx
import { Suspense } from 'react';
import GalleryCategoriesManageClient from './_components/GalleryCategoriesManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const GalleryCategoriesManagePage = () => {
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
      <GalleryCategoriesManageClient />
    </Suspense>
  );
};

export default GalleryCategoriesManagePage;
