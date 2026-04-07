// src/redux/posts/post-api.ts
import { apiSlice } from '../api-slice';
import {
  IPostResponse,
  IPostsPaginatedResponse,
  IPostsQueryParams,
  IPost,
  ITogglePostResponse,
} from '@/types/posts/post.types';

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new post
    createPost: builder.mutation<IPostResponse, FormData>({
      query: (formData) => ({
        url: '/posts',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        'Posts',
        'Post',
        'Categories',
        'Category',
        'CategoryStats',
      ],
    }),

    updatePost: builder.mutation<
      IPostResponse,
      { postId: string; formData: FormData }
    >({
      query: ({ postId, formData }) => ({
        url: `/posts/${postId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Post', id: postId },
        'Posts',
        'Post',
        'Categories',
        'Category',
        'CategoryStats',
      ],
    }),

    getPostByIdOrSlug: builder.query<IPostResponse & { data: IPost }, string>({
      query: (identifier) => ({
        url: `/posts/${identifier}`,
        method: 'GET',
      }),
      providesTags: (result, error, identifier) => [
        { type: 'Post', id: identifier },
      ],
    }),

    getAllPosts: builder.query<IPostsPaginatedResponse, IPostsQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();
        return {
          url: `/posts${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Post' as const, id })),
              'Posts',
            ]
          : ['Posts'],
    }),

    deletePost: builder.mutation<{ message: string }, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, postId) => [
        { type: 'Post', id: postId },
        'Posts',
        'Post',
        'Categories',
        'Category',
        'CategoryStats',
      ],
    }),

    togglePostPublish: builder.mutation<ITogglePostResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Post',
        'Posts',
        'Categories',
        'Category',
        'CategoryStats',
      ],
    }),

    togglePostFeatured: builder.mutation<ITogglePostResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/toggle-featured`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Posts',
        'Post',
        'Categories',
        'Category',
        'CategoryStats',
      ],
    }),

    getPostsByCategory: builder.query<
      IPostsPaginatedResponse,
      { categoryId: string } & Omit<IPostsQueryParams, 'categoryId'>
    >({
      query: ({ categoryId, ...params }) => {
        const searchParams = new URLSearchParams({ categoryId });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/posts?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Posts'],
    }),

    getPostsByAuthor: builder.query<
      IPostsPaginatedResponse,
      { authorId: string } & Omit<IPostsQueryParams, 'authorId'>
    >({
      query: ({ authorId, ...params }) => {
        const searchParams = new URLSearchParams({ authorId });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/posts?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Posts'],
    }),

    getFeaturedPosts: builder.query<
      IPostsPaginatedResponse,
      Omit<IPostsQueryParams, 'isFeatured'>
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams({ isFeatured: 'true' });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/posts?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Posts'],
    }),

    getPublishedPosts: builder.query<
      IPostsPaginatedResponse,
      Omit<IPostsQueryParams, 'isPublished'>
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams({ isPublished: 'true' });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/posts?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Posts'],
    }),

    searchPosts: builder.query<
      IPostsPaginatedResponse,
      { search: string } & Omit<IPostsQueryParams, 'search'>
    >({
      query: ({ search, ...params }) => {
        const searchParams = new URLSearchParams({ search });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/posts?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Posts'],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetPostByIdOrSlugQuery,
  useGetAllPostsQuery,
  useDeletePostMutation,
  useTogglePostPublishMutation,
  useTogglePostFeaturedMutation,
  useGetPostsByCategoryQuery,
  useGetPostsByAuthorQuery,
  useGetFeaturedPostsQuery,
  useGetPublishedPostsQuery,
  useSearchPostsQuery,

  useLazyGetAllPostsQuery,
  useLazyGetPostByIdOrSlugQuery,
  useLazyGetPostsByCategoryQuery,
  useLazyGetPostsByAuthorQuery,
  useLazyGetFeaturedPostsQuery,
  useLazyGetPublishedPostsQuery,
  useLazySearchPostsQuery,
} = postApi;
