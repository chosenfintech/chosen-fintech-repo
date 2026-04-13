// src/types/dashboard.types.ts
export type DashboardPeriod = 'this_month' | 'last_month' | 'all_time';

export interface IDashboardStats {
  period: DashboardPeriod;
  posts: {
    total: number;
    published: number;
    unpublished: number;
    featured: number;
  };
  gallery: {
    total: number;
    published: number;
    unpublished: number;
  };
  categories: {
    posts: number;
    gallery: number;
  };
  users: {
    total: number;
    admins: number;
    regular: number;
  };
}

export interface IDashboardStatsResponse {
  message: string;
  data: IDashboardStats;
}
