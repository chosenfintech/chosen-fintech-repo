// src/types/dashboard.types.ts
export type DashboardPeriod =
  | 'this_month'
  | 'last_month'
  | 'all_time'
  | 'custom';

export interface IContentModuleStats {
  total: number;
  published: number;
  unpublished: number;
  featured: number;
}

export type DashboardContentType =
  | 'post'
  | 'event'
  | 'guide'
  | 'project'
  | 'photo';

export interface IRecentContentItem {
  id: string;
  title: string;
  type: DashboardContentType;
  href: string;
  isPublished: boolean;
  createdAt: string;
}

export interface IDashboardStats {
  period: DashboardPeriod;
  totals: {
    content: number; // posts + events + guides + projects
    published: number;
    drafts: number;
    media: number; // gallery photos
  };
  /**
   * Same metrics for the immediately-preceding equal-length window, used to
   * render trend deltas. Null for "all time" (no comparable previous period).
   */
  previousTotals: {
    content: number;
    published: number;
    drafts: number;
    media: number;
  } | null;
  posts: IContentModuleStats;
  events: IContentModuleStats;
  guides: IContentModuleStats;
  projects: IContentModuleStats;
  gallery: {
    total: number;
    published: number;
    unpublished: number;
  };
  categories: {
    posts: number;
    events: number;
    gallery: number;
  };
  users: {
    total: number;
    admins: number;
    regular: number;
  };
  recent: IRecentContentItem[];
}

export interface IDashboardStatsResponse {
  message: string;
  data: IDashboardStats;
}
