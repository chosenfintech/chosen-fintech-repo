// src/types/posts/category.types.ts
export interface ICategoryResponseData {
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
  data: ICategoryResponseData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
