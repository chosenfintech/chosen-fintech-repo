// src/redux/dashboard-api.ts
import { apiSlice } from './api-slice';
import {
  DashboardPeriod,
  IDashboardStatsResponse,
} from '@/types/dashboard.types';

export interface IDashboardStatsQueryParams {
  period?: DashboardPeriod;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<
      IDashboardStatsResponse,
      IDashboardStatsQueryParams
    >({
      query: ({ period = 'all_time' } = {}) => ({
        url: `/dashboard/stats?period=${period}`,
        method: 'GET',
      }),
      providesTags: ['DashboardStats'],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useLazyGetDashboardStatsQuery } =
  dashboardApi;
