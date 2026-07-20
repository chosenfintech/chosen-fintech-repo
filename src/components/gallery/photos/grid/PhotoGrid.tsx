// src/components/gallery/photos/grid/PhotoGrid.tsx
'use client';
import * as React from 'react';
import toast from 'react-hot-toast';
import { ImageIcon, Plus } from 'lucide-react';
import { GalleryPhotoGridToolbar } from './GridToolbar';
import { PhotoCard } from './PhotoCard';
import { GridSkeleton } from './GridSkeleton';
import Pagination from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useDeleteGalleryPhotoMutation } from '@/redux/gallery/gallery-photo-api';
import { extractApiError } from '@/utils/extract-api-error';
import {
  IGalleryPhoto,
  IGalleryPhotosQueryParams,
} from '@/types/gallery/gallery-photo.types';

type IGalleryPhotoFilters = Omit<IGalleryPhotosQueryParams, 'page' | 'limit'>;

interface PhotoGridProps {
  data: IGalleryPhoto[];
  loading?: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: IGalleryPhotoFilters;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onFiltersChange: (filters: Partial<IGalleryPhotoFilters>) => void;
  onRefresh?: () => void;
  onUploadPhoto: () => void;
}

export function PhotoGrid({
  data,
  loading = false,
  totalCount,
  page,
  pageSize,
  totalPages,
  filters,
  onPageChange,
  onPageSizeChange,
  onFiltersChange,
  onRefresh,
  onUploadPhoto,
}: PhotoGridProps) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const [deletePhoto] = useDeleteGalleryPhotoMutation();

  // Drop selections for photos that fell off the current page (filter, page
  // change) so the toolbar count never counts rows the user cannot see.
  React.useEffect(() => {
    setSelectedIds((prev) => {
      const visible = new Set(data.map((p) => p.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (visible.has(id)) next.add(id);
      });
      return next.size === prev.size ? prev : next;
    });
  }, [data]);

  const toggleOne = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const selectPage = () =>
    setSelectedIds(new Set(data.map((photo) => photo.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const handleDeleteSelected = async () => {
    const ids = [...selectedIds];
    setDeleteOpen(false);

    const toastId = toast.loading(
      `Deleting ${ids.length} ${ids.length === 1 ? 'photo' : 'photos'}...`,
    );

    try {
      await Promise.all(ids.map((id) => deletePhoto(id).unwrap()));
      toast.dismiss(toastId);
      toast.success(
        `${ids.length} ${ids.length === 1 ? 'photo' : 'photos'} deleted successfully`,
      );
      clearSelection();
      onRefresh?.();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(extractApiError(error).message);
    }
  };

  const hasActiveFilters =
    !!filters.search ||
    filters.isPublished !== undefined ||
    filters.categoryId !== undefined;

  // Nothing at all (and not filtered): the friendly first-run empty state.
  if (!loading && totalCount === 0 && !hasActiveFilters) {
    return (
      <EmptyState
        icon={ImageIcon}
        onCreateClick={onUploadPhoto}
        title="No Photos Yet"
        description="Get started by uploading your first photo to the gallery."
        buttonText="Upload Your First Photo"
        buttonIcon={Plus}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      <GalleryPhotoGridToolbar
        filters={filters}
        onFiltersChange={onFiltersChange}
        totalCount={totalCount}
        selectedCount={selectedIds.size}
        pageCount={data.length}
        onSelectPage={selectPage}
        onClearSelection={clearSelection}
        onUploadPhoto={onUploadPhoto}
        onDeleteSelected={() => setDeleteOpen(true)}
      />

      {loading ? (
        <GridSkeleton count={pageSize} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          showCreateButton={false}
          title="No Matching Photos"
          description="No photos match your current filters. Try adjusting your search criteria or clear the filters."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              selected={selectedIds.has(photo.id)}
              onSelectedChange={(selected) => toggleOne(photo.id, selected)}
            />
          ))}
        </div>
      )}

      {totalCount > pageSize && (
        <Pagination
          meta={{ total: totalCount, page, limit: pageSize, totalPages }}
          onPageChange={onPageChange}
          onLimitChange={onPageSizeChange}
          showPageSizeSelector
          pageSizeOptions={[12, 24, 48, 96]}
        />
      )}

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Selected Photos"
        description={`Are you sure you want to delete ${selectedIds.size} selected ${selectedIds.size === 1 ? 'photo' : 'photos'}? This action cannot be undone and will remove the images from storage.`}
        onConfirm={handleDeleteSelected}
        confirmText="Delete Selected"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
