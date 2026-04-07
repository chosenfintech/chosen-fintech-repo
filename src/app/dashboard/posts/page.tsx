// src/app/dashboard/posts/page.tsx
import { Suspense } from 'react';
import PostsManageClient from './_components/PostsManageClient';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const PostsManagePage = () => {
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
      <PostsManageClient />
    </Suspense>
  );
};

export default PostsManagePage;
