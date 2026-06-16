// src/redux/dashboard-api.ts
import { apiSlice } from './api-slice';
import {
  DashboardPeriod,
  IDashboardStatsResponse,
} from '@/types/dashboard.types';

export interface IDashboardStatsQueryParams {
  period?: DashboardPeriod;
  from?: string;
  to?: string;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<
      IDashboardStatsResponse,
      IDashboardStatsQueryParams
    >({
      query: ({ period = 'all_time', from, to } = {}) => {
        const params = new URLSearchParams({ period });
        if (period === 'custom' && from && to) {
          params.set('from', from);
          params.set('to', to);
        }
        return { url: `/dashboard/stats?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['DashboardStats'],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useLazyGetDashboardStatsQuery } =
  dashboardApi;
