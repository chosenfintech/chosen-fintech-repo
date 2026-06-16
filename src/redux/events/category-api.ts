// src/redux/events/category-api.ts
import { apiSlice } from '../api-slice';
import {
  ICategoriesPaginatedResponse,
  ICategoriesQueryParams,
  IEventCategoryResponse,
  IEventCategoryCreateInput,
  IEventCategoryUpdateInput,
} from '@/types/events/category.types';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEventCategory: builder.mutation<IEventCategoryResponse, IEventCategoryCreateInput>({
      query: (categoryData) => ({
        url: '/events/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Categories', 'EventCategoryStats'],
    }),

    updateEventCategory: builder.mutation<
      IEventCategoryResponse,
      { categoryId: string; categoryData: IEventCategoryUpdateInput }
    >({
      query: ({ categoryId, categoryData }) => ({
        url: `/events/categories/${categoryId}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: 'EventCategory', id: categoryId },
        'Categories',
        'EventCategoryStats',
        'Events',
      ],
    }),

    getAllEventCategories: builder.query<
      ICategoriesPaginatedResponse,
      ICategoriesQueryParams
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();
        return {
          url: `/events/categories${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'EventCategory' as const,
                id,
              })),
              'Categories',
            ]
          : ['Categories'],
    }),

    deleteEventCategory: builder.mutation<{ message: string }, string>({
      query: (categoryId) => ({
        url: `/events/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: 'EventCategory', id: categoryId },
        'Categories',
        'EventCategoryStats',
      ],
    }),

    getEventCategoriesForSelect: builder.query<{ id: string; name: string }[], void>(
      {
        query: () => ({
          url: '/events/categories?limit=1000&sortBy=name&sortOrder=asc',
          method: 'GET',
        }),
        transformResponse: (response: ICategoriesPaginatedResponse) =>
          response.data.map(
            ({
              id,
              name,
              totalEventsCount,
              publishedEventsCount,
              unpublishedEventsCount,
            }) => ({
              id,
              name,
              totalEventsCount,
              publishedEventsCount,
              unpublishedEventsCount,
            }),
          ),
        providesTags: ['Categories'],
      },
    ),

    getTopEventCategories: builder.query<IEventCategoryResponse[], { limit?: number }>({
      query: ({ limit = 10 } = {}) => ({
        url: `/events/categories?limit=${limit}&sortBy=eventCount&sortOrder=desc`,
        method: 'GET',
      }),
      transformResponse: (response: ICategoriesPaginatedResponse) =>
        response.data.map((category) => ({
          message: '',
          data: category,
        })),
      providesTags: ['Categories'],
    }),
  }),
});

export const {
  useCreateEventCategoryMutation,
  useUpdateEventCategoryMutation,
  useGetAllEventCategoriesQuery,
  useDeleteEventCategoryMutation,
  useGetEventCategoriesForSelectQuery,
  useGetTopEventCategoriesQuery,

  // Lazy queries
  useLazyGetAllEventCategoriesQuery,
  useLazyGetTopEventCategoriesQuery,
} = categoryApi;
