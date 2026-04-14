// src/redux/gallery/gallery-category-api.ts
import { apiSlice } from '../api-slice';
import type {
  IGalleryCategory,
  IGalleryCategoryResponse,
  IGalleryCategoriesPaginatedResponse,
  IGalleryCategoriesQueryParams,
  IGalleryCategoryCreateInput,
  IGalleryCategoryUpdateInput,
} from '@/types/gallery/gallery-category.types';

export const galleryCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGalleryCategory: builder.mutation<
      IGalleryCategoryResponse,
      IGalleryCategoryCreateInput
    >({
      query: (categoryData) => ({
        url: '/gallery/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['GalleryCategories', 'GalleryCategory'],
    }),

    updateGalleryCategory: builder.mutation<
      IGalleryCategoryResponse,
      { categoryId: string; data: IGalleryCategoryUpdateInput }
    >({
      query: ({ categoryId, data }) => ({
        url: `/gallery/categories/${categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: 'GalleryCategory', id: categoryId },
        'GalleryCategories',
        'GalleryPhotos',
      ],
    }),

    getAllGalleryCategories: builder.query<
      IGalleryCategoriesPaginatedResponse,
      IGalleryCategoriesQueryParams
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
          url: `/gallery/categories${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'GalleryCategory' as const,
                id,
              })),
              'GalleryCategories',
            ]
          : ['GalleryCategories'],
    }),

    deleteGalleryCategory: builder.mutation<{ message: string }, string>({
      query: (categoryId) => ({
        url: `/gallery/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: 'GalleryCategory', id: categoryId },
        'GalleryCategories',
        'GalleryPhotos',
        'GalleryPhoto',
      ],
    }),

    toggleGalleryCategoryFeatured: builder.mutation<
      {
        message: string;
        data: { id: string; name: string; isFeatured: boolean };
      },
      string
    >({
      query: (categoryId) => ({
        url: `/gallery/categories/${categoryId}/toggle-featured`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: 'GalleryCategory', id: categoryId },
        'GalleryCategories',
      ],
    }),

    getGalleryCategoriesForSelect: builder.query<
      Pick<
        IGalleryCategory,
        'id' | 'name' | 'isFeatured' | 'totalPhotosCount'
      >[],
      void
    >({
      query: () => ({
        url: '/gallery/categories?limit=1000&sortBy=name&sortOrder=asc',
        method: 'GET',
      }),
      transformResponse: (response: IGalleryCategoriesPaginatedResponse) =>
        response.data.map(({ id, name, isFeatured, totalPhotosCount }) => ({
          id,
          name,
          isFeatured,
          totalPhotosCount,
        })),
      providesTags: ['GalleryCategories'],
    }),
  }),
});

export const {
  useCreateGalleryCategoryMutation,
  useUpdateGalleryCategoryMutation,
  useGetAllGalleryCategoriesQuery,
  useDeleteGalleryCategoryMutation,
  useToggleGalleryCategoryFeaturedMutation,
  useGetGalleryCategoriesForSelectQuery,

  useLazyGetAllGalleryCategoriesQuery,
  useLazyGetGalleryCategoriesForSelectQuery,
} = galleryCategoryApi;
