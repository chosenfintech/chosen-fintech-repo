// src/types/guides/guide.types.ts
export type GuideLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export const GUIDE_LEVELS: GuideLevel[] = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
];

export interface IGuideCreateInput {
  title: string;
  description: string;
  content: string;
  level?: GuideLevel;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGuideUpdateInput extends Partial<IGuideCreateInput> {
  image?: string;
}

export interface IGuide {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  readTime: string;
  image: string | null;
  level: GuideLevel;
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

export interface IGuidesQueryParams {
  page?: number;
  limit?: number;
  level?: GuideLevel;
  authorId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface IGuidesPaginatedResponse {
  message: string;
  data: IGuide[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IGuideResponse {
  message: string;
  data: IGuide;
}

export interface IToggleGuideResponse {
  message: string;
  data: {
    id: string;
    title: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    publishDate?: Date;
  };
}

export interface IGuidesDataTableProps {
  data: IGuide[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<IGuidesQueryParams, 'page' | 'limit'>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<IGuidesQueryParams, 'page' | 'limit'>>,
  ) => void;
  onRefresh?: () => void;
}
