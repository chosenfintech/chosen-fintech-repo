// src/redux/gallery/gallery-photo-api.ts
import { apiSlice } from '../api-slice';
import type {
  IGalleryPhoto,
  IGalleryPhotoResponse,
  IGalleryPhotosPaginatedResponse,
  IGalleryPhotosQueryParams,
  IGalleryPhotoUpdateInput,
} from '@/types/gallery/gallery-photo.types';

export const galleryPhotoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGalleryPhoto: builder.mutation<IGalleryPhotoResponse, FormData>({
      query: (formData) => ({
        url: '/gallery/photos',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        'GalleryPhotos',
        'GalleryPhoto',
        'GalleryCategories',
        'GalleryCategory',
      ],
    }),

    updateGalleryPhoto: builder.mutation<
      IGalleryPhotoResponse,
      { photoId: string; data: IGalleryPhotoUpdateInput }
    >({
      query: ({ photoId, data }) => ({
        url: `/gallery/photos/${photoId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { photoId }) => [
        { type: 'GalleryPhoto', id: photoId },
        'GalleryPhotos',
        'GalleryCategories',
        'GalleryCategory',
      ],
    }),

    getGalleryPhotoById: builder.query<
      IGalleryPhotoResponse & { data: IGalleryPhoto },
      string
    >({
      query: (photoId) => ({
        url: `/gallery/photos/${photoId}`,
        method: 'GET',
      }),
      providesTags: (result, error, photoId) => [
        { type: 'GalleryPhoto', id: photoId },
      ],
    }),

    getAllGalleryPhotos: builder.query<
      IGalleryPhotosPaginatedResponse,
      IGalleryPhotosQueryParams
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
          url: `/gallery/photos${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'GalleryPhoto' as const,
                id,
              })),
              'GalleryPhotos',
            ]
          : ['GalleryPhotos'],
    }),

    getPublishedGalleryPhotos: builder.query<
      IGalleryPhotosPaginatedResponse,
      Omit<IGalleryPhotosQueryParams, 'isPublished'>
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
          url: `/gallery/photos/published${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'GalleryPhoto' as const,
                id,
              })),
              'GalleryPhotos',
            ]
          : ['GalleryPhotos'],
    }),

    deleteGalleryPhoto: builder.mutation<{ message: string }, string>({
      query: (photoId) => ({
        url: `/gallery/photos/${photoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, photoId) => [
        { type: 'GalleryPhoto', id: photoId },
        'GalleryPhotos',
        'GalleryCategories',
        'GalleryCategory',
      ],
    }),

    toggleGalleryPhotoPublish: builder.mutation<
      { message: string; data: { id: string; isPublished: boolean } },
      string
    >({
      query: (photoId) => ({
        url: `/gallery/photos/${photoId}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, photoId) => [
        { type: 'GalleryPhoto', id: photoId },
        'GalleryPhotos',
        'GalleryCategories',
        'GalleryCategory',
      ],
    }),

    getGalleryPhotosByCategory: builder.query<
      IGalleryPhotosPaginatedResponse,
      { categoryId: string } & Omit<IGalleryPhotosQueryParams, 'categoryId'>
    >({
      query: ({ categoryId, ...params }) => {
        const searchParams = new URLSearchParams({ categoryId });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/gallery/photos?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['GalleryPhotos'],
    }),

    searchGalleryPhotos: builder.query<
      IGalleryPhotosPaginatedResponse,
      { search: string } & Omit<IGalleryPhotosQueryParams, 'search'>
    >({
      query: ({ search, ...params }) => {
        const searchParams = new URLSearchParams({ search });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/gallery/photos?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['GalleryPhotos'],
    }),
  }),
});

export const {
  useCreateGalleryPhotoMutation,
  useUpdateGalleryPhotoMutation,
  useGetGalleryPhotoByIdQuery,
  useGetAllGalleryPhotosQuery,
  useGetPublishedGalleryPhotosQuery,
  useDeleteGalleryPhotoMutation,
  useToggleGalleryPhotoPublishMutation,
  useGetGalleryPhotosByCategoryQuery,
  useSearchGalleryPhotosQuery,

  useLazyGetAllGalleryPhotosQuery,
  useLazyGetGalleryPhotoByIdQuery,
  useLazyGetPublishedGalleryPhotosQuery,
  useLazyGetGalleryPhotosByCategoryQuery,
  useLazySearchGalleryPhotosQuery,
} = galleryPhotoApi;
