// src/types/gallery/gallery-photo.types.ts
export interface IGalleryPhoto {
  id: string;
  url: string;
  altText: string | null;
  caption: string | null;
  isPublished: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    isFeatured: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryPhotoCreateInput {
  altText?: string;
  caption?: string;
  isPublished?: boolean;
  categoryId: string;
}

export interface IGalleryPhotoUpdateInput {
  altText?: string | null;
  caption?: string | null;
  isPublished?: boolean;
}

export interface IGalleryPhotosQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  isPublished?: boolean;
  search?: string;
}

export interface IGalleryPhotosPaginatedResponse {
  message: string;
  data: IGalleryPhoto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IGalleryPhotoResponse {
  message: string;
  data: IGalleryPhoto;
}

export interface IGalleryPhotosDataTableProps {
  data: IGalleryPhoto[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<IGalleryPhotosQueryParams, 'page' | 'limit'>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<IGalleryPhotosQueryParams, 'page' | 'limit'>>,
  ) => void;
  onRefresh?: () => void;
}
