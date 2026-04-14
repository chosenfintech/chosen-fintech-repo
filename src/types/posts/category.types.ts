// src/types/posts/category.types.ts
export interface ICategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  publishedPostsCount?: number;
  unpublishedPostsCount?: number;
  totalPostsCount: number;
}

export interface ICategoryCreateInput {
  name: string;
}

export type ICategoryUpdateInput = Partial<ICategoryCreateInput>;

export interface ICategoriesPaginatedResponse {
  message: string;
  data: ICategory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ICategoryResponse {
  message: string;
  data: ICategory;
}

export interface ICategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ICategoriesDataTableProps {
  data: ICategory[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<ICategoriesQueryParams, 'page' | 'limit'>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<ICategoriesQueryParams, 'page' | 'limit'>>,
  ) => void;
  onRefresh?: () => void;
}
