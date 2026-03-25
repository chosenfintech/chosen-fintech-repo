// src/types/user.types.ts
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserResponse {
  message: string;
  data: IUser;
}

export interface IUsersPaginatedResponse {
  message: string;
  data: IUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IDeleteUsersResponse {
  message: string;
  deletedCount: number;
}

export interface IUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IUsersDataTableProps {
  data: IUser[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<IUsersQueryParams, "page" | "limit">;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<IUsersQueryParams, "page" | "limit">>,
  ) => void;
  onRefresh?: () => void;
}
