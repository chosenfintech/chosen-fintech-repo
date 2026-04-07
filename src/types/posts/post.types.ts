// src/types/posts/post.types.ts
export interface IPostCreateInput {
  title: string;
  excerpt: string;
  content: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishDate?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPostUpdateInput extends Partial<IPostCreateInput> {
  coverImage?: string;
}

export interface IPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  coverImage: string | null;
  isPublished: boolean;
  isFeatured: boolean | null;
  publishDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    fullname: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
}

export interface IPostsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  authorId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface IPostsPaginatedResponse {
  message: string;
  data: IPost[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IPostResponse {
  message: string;
  data: IPost;
}

export interface ITogglePostResponse {
  message: string;
  data: {
    id: string;
    title: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    publishDate?: Date;
  };
}

export interface IPostsDataTableProps {
  data: IPost[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<IPostsQueryParams, 'page' | 'limit'>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<IPostsQueryParams, 'page' | 'limit'>>,
  ) => void;
  onRefresh?: () => void;
}
