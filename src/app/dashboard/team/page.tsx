// src/app/dashboard/team/page.tsx
import { Suspense } from 'react';
import TeamManageClient from './_components/TeamManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const TeamManagePage = () => {
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
      <TeamManageClient />
    </Suspense>
  );
};

export default TeamManagePage;
