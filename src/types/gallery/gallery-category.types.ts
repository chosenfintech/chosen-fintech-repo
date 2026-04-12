// src/types/gallery/gallery-category.types.ts
export interface IGalleryCategory {
  id: string;
  name: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedPhotosCount?: number;
  unpublishedPhotosCount?: number;
  totalPhotosCount: number;
}

export interface IGalleryCategoryCreateInput {
  name: string;
  isFeatured?: boolean;
}

export type IGalleryCategoryUpdateInput = Partial<IGalleryCategoryCreateInput>;

export interface IGalleryCategoriesPaginatedResponse {
  message: string;
  data: IGalleryCategory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IGalleryCategoryResponse {
  message: string;
  data: IGalleryCategory;
}

export interface IGalleryCategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IGalleryCategoriesDataTableProps {
  data: IGalleryCategory[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<IGalleryCategoriesQueryParams, 'page' | 'limit'>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<IGalleryCategoriesQueryParams, 'page' | 'limit'>>,
  ) => void;
  onRefresh?: () => void;
}
