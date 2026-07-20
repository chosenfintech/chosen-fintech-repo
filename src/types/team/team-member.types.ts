// src/types/team/team-member.types.ts
export interface ITeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  email: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamMemberUpdateInput {
  name?: string;
  role?: string;
  email?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  displayOrder?: number;
  isPublished?: boolean;
}

export interface ITeamMembersQueryParams {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  search?: string;
}

export interface ITeamMembersPaginatedResponse {
  message: string;
  data: ITeamMember[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ITeamMemberResponse {
  message: string;
  data: ITeamMember;
}

export interface ITeamMembersDataTableProps {
  data: ITeamMember[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  filters: Omit<ITeamMembersQueryParams, 'page' | 'limit'>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFiltersChange: (
    filters: Partial<Omit<ITeamMembersQueryParams, 'page' | 'limit'>>,
  ) => void;
  onRefresh?: () => void;
}
