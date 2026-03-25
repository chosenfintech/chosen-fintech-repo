// src/redux/user-api.ts
import { apiSlice } from "./api-slice";
import {
  IDeleteUsersResponse,
  IUserResponse,
  IUsersPaginatedResponse,
  IUsersQueryParams,
} from "@/types/user.types";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<IUserResponse, FormData>({
      query: (formData) => ({
        url: "/users",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }, "DashboardStats"],
    }),

    updateUser: builder.mutation<
      IUserResponse,
      { userId: string; formData: FormData }
    >({
      query: ({ userId, formData }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
        { type: "Users", id: "LIST" },
        "DashboardStats",
      ],
    }),

    getUser: builder.query<IUserResponse, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    getAllUsers: builder.query<IUsersPaginatedResponse, IUsersQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/users${
            searchParams.toString() ? `?${searchParams.toString()}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "Users" as const, id: "LIST" },
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),

    deleteUser: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: userId },
        { type: "Users", id: "LIST" },
        "DashboardStats",
      ],
    }),

    deleteAllUsers: builder.mutation<
      IDeleteUsersResponse,
      { confirmDelete: string }
    >({
      query: (body) => ({
        url: "/users",
        method: "DELETE",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }, "DashboardStats"],
    }),

    searchUsers: builder.query<
      IUsersPaginatedResponse,
      { search: string } & Omit<IUsersQueryParams, "search">
    >({
      query: ({ search, ...params }) => {
        const searchParams = new URLSearchParams({ search });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/users?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "Users" as const, id: "LIST" },
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),

    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/users/change-password",
        method: "PATCH",
        body: data,
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
  useDeleteAllUsersMutation,
  useSearchUsersQuery,
  useChangePasswordMutation,

  // Lazy queries
  useLazyGetAllUsersQuery,
  useLazyGetUserQuery,
  useLazySearchUsersQuery,
} = userApi;
