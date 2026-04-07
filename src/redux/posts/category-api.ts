// src/redux/posts/category-api.ts
import { apiSlice } from '../api-slice';
import {
  ICategoriesPaginatedResponse,
  ICategoriesQueryParams,
  ICategoryResponse,
  ICategoryCreateInput,
  ICategoryUpdateInput,
  IDeleteCategoryResponse,
  ICategoriesStatsResponse,
} from '@/types/posts/category.types';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<ICategoryResponse, ICategoryCreateInput>({
      query: (categoryData) => ({
        url: '/posts/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Categories', 'CategoryStats'],
    }),

    updateCategory: builder.mutation<
      ICategoryResponse,
      { categoryId: string; categoryData: ICategoryUpdateInput }
    >({
      query: ({ categoryId, categoryData }) => ({
        url: `/posts/categories/${categoryId}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: 'Category', id: categoryId },
        'Categories',
        'CategoryStats',
        'Posts',
      ],
    }),

    getCategoryByIdOrName: builder.query<ICategoryResponse, string>({
      query: (identifier) => ({
        url: `/posts/categories/${identifier}`,
        method: 'GET',
      }),
      providesTags: (result, error, identifier) => [
        { type: 'Category', id: identifier },
      ],
    }),

    getAllCategories: builder.query<
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
          url: `/posts/categories${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Category' as const,
                id,
              })),
              'Categories',
            ]
          : ['Categories'],
    }),

    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (categoryId) => ({
        url: `/posts/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: 'Category', id: categoryId },
        'Categories',
        'CategoryStats',
      ],
    }),

    deleteAllCategories: builder.mutation<
      IDeleteCategoryResponse,
      { confirmDelete: string }
    >({
      query: (body) => ({
        url: '/posts/categories',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Categories', 'CategoryStats', 'Posts'],
    }),

    getCategoryStats: builder.query<ICategoriesStatsResponse, void>({
      query: () => ({
        url: '/posts/categories/stats',
        method: 'GET',
      }),
      providesTags: ['CategoryStats'],
    }),

    getCategoriesForSelect: builder.query<{ id: string; name: string }[], void>(
      {
        query: () => ({
          url: '/posts/categories?limit=1000&sortBy=name&sortOrder=asc',
          method: 'GET',
        }),
        transformResponse: (response: ICategoriesPaginatedResponse) =>
          response.data.map(
            ({
              id,
              name,
              totalPostsCount,
              publishedPostsCount,
              unpublishedPostsCount,
            }) => ({
              id,
              name,
              totalPostsCount,
              publishedPostsCount,
              unpublishedPostsCount,
            }),
          ),
        providesTags: ['Categories'],
      },
    ),

    getTopCategories: builder.query<ICategoryResponse[], { limit?: number }>({
      query: ({ limit = 10 } = {}) => ({
        url: `/posts/categories?limit=${limit}&sortBy=postCount&sortOrder=desc`,
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
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoryByIdOrNameQuery,
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useDeleteAllCategoriesMutation,
  useGetCategoryStatsQuery,
  useGetCategoriesForSelectQuery,
  useGetTopCategoriesQuery,

  // Lazy queries
  useLazyGetAllCategoriesQuery,
  useLazyGetCategoryByIdOrNameQuery,
  useLazyGetCategoryStatsQuery,
  useLazyGetTopCategoriesQuery,
} = categoryApi;
