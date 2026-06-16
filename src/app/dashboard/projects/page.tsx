// src/app/dashboard/projects/page.tsx
import { Suspense } from 'react';
import ProjectsManageClient from './_components/ProjectsManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const ProjectsManagePage = () => {
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
      <ProjectsManageClient />
    </Suspense>
  );
};

export default ProjectsManagePage;
