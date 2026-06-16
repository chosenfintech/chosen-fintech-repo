// src/redux/guides/guide-api.ts
import { apiSlice } from '../api-slice';
import {
  IGuideResponse,
  IGuidesPaginatedResponse,
  IGuidesQueryParams,
  IGuide,
  IToggleGuideResponse,
} from '@/types/guides/guide.types';

export const guideApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new guide
    createGuide: builder.mutation<IGuideResponse, FormData>({
      query: (formData) => ({
        url: '/guides',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        'Guides',
        'Guide',
        'Categories',
      ],
    }),

    updateGuide: builder.mutation<
      IGuideResponse,
      { guideId: string; formData: FormData }
    >({
      query: ({ guideId, formData }) => ({
        url: `/guides/${guideId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { guideId }) => [
        { type: 'Guide', id: guideId },
        'Guides',
        'Guide',
        'Categories',
      ],
    }),

    getGuideByIdOrSlug: builder.query<IGuideResponse & { data: IGuide }, string>({
      query: (identifier) => ({
        url: `/guides/${identifier}`,
        method: 'GET',
      }),
      providesTags: (result, error, identifier) => [
        { type: 'Guide', id: identifier },
      ],
    }),

    getAllGuides: builder.query<IGuidesPaginatedResponse, IGuidesQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();
        return {
          url: `/guides${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Guide' as const, id })),
              'Guides',
            ]
          : ['Guides'],
    }),

    deleteGuide: builder.mutation<{ message: string }, string>({
      query: (guideId) => ({
        url: `/guides/${guideId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, guideId) => [
        { type: 'Guide', id: guideId },
        'Guides',
        'Guide',
        'Categories',
      ],
    }),

    toggleGuidePublish: builder.mutation<IToggleGuideResponse, string>({
      query: (guideId) => ({
        url: `/guides/${guideId}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Guide',
        'Guides',
        'Categories',
      ],
    }),

    toggleGuideFeatured: builder.mutation<IToggleGuideResponse, string>({
      query: (guideId) => ({
        url: `/guides/${guideId}/toggle-featured`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Guides',
        'Guide',
        'Categories',
      ],
    }),

    getPublishedGuides: builder.query<
      IGuidesPaginatedResponse,
      Omit<IGuidesQueryParams, 'isPublished'>
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams({ isPublished: 'true' });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/guides?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Guides'],
    }),

    searchGuides: builder.query<
      IGuidesPaginatedResponse,
      { search: string } & Omit<IGuidesQueryParams, 'search'>
    >({
      query: ({ search, ...params }) => {
        const searchParams = new URLSearchParams({ search });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/guides?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Guides'],
    }),
  }),
});

export const {
  useCreateGuideMutation,
  useUpdateGuideMutation,
  useGetGuideByIdOrSlugQuery,
  useGetAllGuidesQuery,
  useDeleteGuideMutation,
  useToggleGuidePublishMutation,
  useToggleGuideFeaturedMutation,
  useGetPublishedGuidesQuery,
  useSearchGuidesQuery,

  useLazyGetAllGuidesQuery,
  useLazyGetGuideByIdOrSlugQuery,
  useLazyGetPublishedGuidesQuery,
  useLazySearchGuidesQuery,
} = guideApi;
