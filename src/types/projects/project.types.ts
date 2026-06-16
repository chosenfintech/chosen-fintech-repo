// src/types/projects/project.types.ts
export interface IProjectCreateInput {
  title: string;
  description: string;
  content: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProjectUpdateInput extends Partial<IProjectCreateInput> {
  imageUrl?: string;
}

export interface IProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  readTime: string;
  imageUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean | null;
  publishDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    fullname: string;
    email?: string;
  };
}

export interface IProjectsQueryParams {
  page?: number;
  limit?: number;
  authorId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface IProjectsPaginatedResponse {
  message: string;
  data: IProject[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IProjectResponse {
  message: string;
  data: IProject;
}

export interface IToggleProjectResponse {
  message: string;
  data: {
    id: string;
    title: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    publishDate?: Date;
  };
}

export interface IProjectsDataTableProps {
  data: IProject[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<IProjectsQueryParams, 'page' | 'limit'>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<IProjectsQueryParams, 'page' | 'limit'>>,
  ) => void;
  onRefresh?: () => void;
}
