// src/types/events/event.types.ts
export interface IEventCreateInput {
  title: string;
  excerpt: string;
  content: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishDate?: string;
  categoryId?: string;
  eventDate?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEventUpdateInput extends Partial<IEventCreateInput> {
  coverImage?: string;
}

export interface IEvent {
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
  eventDate: Date | null;
  location: string | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    fullname: string;
    email?: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
}

export interface IEventsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  authorId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface IEventsPaginatedResponse {
  message: string;
  data: IEvent[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IEventResponse {
  message: string;
  data: IEvent;
}

export interface IToggleEventResponse {
  message: string;
  data: {
    id: string;
    title: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    publishDate?: Date;
  };
}

export interface IEventsDataTableProps {
  data: IEvent[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<IEventsQueryParams, 'page' | 'limit'>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<IEventsQueryParams, 'page' | 'limit'>>,
  ) => void;
  onRefresh?: () => void;
}
