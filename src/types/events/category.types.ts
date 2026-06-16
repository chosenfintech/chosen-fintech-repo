// src/types/events/category.types.ts
export interface IEventCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  publishedEventsCount?: number;
  unpublishedEventsCount?: number;
  totalEventsCount: number;
}

export interface IEventCategoryCreateInput {
  name: string;
}

export type IEventCategoryUpdateInput = Partial<IEventCategoryCreateInput>;

export interface ICategoriesPaginatedResponse {
  message: string;
  data: IEventCategory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IEventCategoryResponse {
  message: string;
  data: IEventCategory;
}

export interface ICategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ICategoriesDataTableProps {
  data: IEventCategory[];
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
