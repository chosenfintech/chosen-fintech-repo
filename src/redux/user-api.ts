// src/redux/user-api.ts
import { apiSlice } from './api-slice';
import {
  IUserResponse,
  IUsersPaginatedResponse,
  IUsersQueryParams,
  ICreateUserInput,
  IUpdateUserInput,
} from '@/types/user.types';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<IUserResponse, ICreateUserInput>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }, 'DashboardStats'],
    }),

    updateUser: builder.mutation<
      IUserResponse,
      { userId: string; body: IUpdateUserInput }
    >({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'Users', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    getUser: builder.query<IUserResponse, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    getAllUsers: builder.query<IUsersPaginatedResponse, IUsersQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();

        return `/users${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'User' as const,
                id,
              })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users' as const, id: 'LIST' }],
    }),

    deleteUser: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        { type: 'Users', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    changePassword: builder.mutation<
      { message: string },
      { userId: string; currentPassword: string; newPassword: string }
    >({
      query: ({ userId, ...body }) => ({
        url: `/users/${userId}/change-password`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useChangePasswordMutation,

  // Lazy queries
  useLazyGetAllUsersQuery,
  useLazyGetUserQuery,
} = userApi;
