// src/app/dashboard/events/categories/page.tsx
import { Suspense } from 'react';
import CategoriesManageClient from './_components/CategoriesManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const CategoriesManagePage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto">
          <DataTableSkeleton
            columnCount={6}
            rowCount={10}
            showFilters={true}
            filterCount={1}
            showActions={true}
            showPagination={true}
          />
        </div>
      }
    >
      <CategoriesManageClient />
    </Suspense>
  );
};

export default CategoriesManagePage;
