// src/app/dashboard/users/page.tsx
import { Suspense } from 'react';
import UsersManageClient from './_components/UsersManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const UsersManagePage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto">
          <DataTableSkeleton
            columnCount={5}
            rowCount={10}
            showFilters={true}
            filterCount={1}
            showActions={true}
            showPagination={true}
            showAvatar={false}
          />
        </div>
      }
    >
      <UsersManageClient />
    </Suspense>
  );
};

export default UsersManagePage;
