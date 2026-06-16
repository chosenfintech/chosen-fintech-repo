// src/app/dashboard/academy/page.tsx
import { Suspense } from 'react';
import GuidesManageClient from './_components/GuidesManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const GuidesManagePage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto">
          <DataTableSkeleton
            columnCount={7}
            rowCount={10}
            showFilters={true}
            showActions={true}
            showPagination={true}
          />
        </div>
      }
    >
      <GuidesManageClient />
    </Suspense>
  );
};

export default GuidesManagePage;
