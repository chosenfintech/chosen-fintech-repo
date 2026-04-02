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

export interface IPostResponseData {
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

export interface PostQueryParams {
  page?: string;
  limit?: string;
  categoryId?: string;
  authorId?: string;
  isPublished?: string;
  isFeatured?: string;
  search?: string;
}

export interface IPostsPaginatedResponse {
  message: string;
  data: IPostResponseData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
