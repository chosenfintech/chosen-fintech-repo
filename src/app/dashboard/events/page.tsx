// src/app/dashboard/events/page.tsx
import { Suspense } from 'react';
import EventsManageClient from './_components/EventsManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const EventsManagePage = () => {
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
      <EventsManageClient />
    </Suspense>
  );
};

export default EventsManagePage;
