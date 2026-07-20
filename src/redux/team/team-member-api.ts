// src/redux/team/team-member-api.ts
import { apiSlice } from '../api-slice';
import type {
  ITeamMemberResponse,
  ITeamMembersPaginatedResponse,
  ITeamMembersQueryParams,
} from '@/types/team/team-member.types';

const buildQueryString = (params: object): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const teamMemberApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTeamMember: builder.mutation<ITeamMemberResponse, FormData>({
      query: (formData) => ({
        url: '/team',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['TeamMembers', 'TeamMember'],
    }),

    updateTeamMember: builder.mutation<
      ITeamMemberResponse,
      { memberId: string; data: FormData }
    >({
      query: ({ memberId, data }) => ({
        url: `/team/${memberId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { memberId }) => [
        { type: 'TeamMember', id: memberId },
        'TeamMembers',
      ],
    }),

    getTeamMemberById: builder.query<ITeamMemberResponse, string>({
      query: (memberId) => ({
        url: `/team/${memberId}`,
        method: 'GET',
      }),
      providesTags: (result, error, memberId) => [
        { type: 'TeamMember', id: memberId },
      ],
    }),

    getAllTeamMembers: builder.query<
      ITeamMembersPaginatedResponse,
      ITeamMembersQueryParams
    >({
      query: (params = {}) => ({
        url: `/team${buildQueryString(params)}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'TeamMember' as const,
                id,
              })),
              'TeamMembers',
            ]
          : ['TeamMembers'],
    }),

    getPublishedTeamMembers: builder.query<
      ITeamMembersPaginatedResponse,
      Omit<ITeamMembersQueryParams, 'isPublished'>
    >({
      query: (params = {}) => ({
        url: `/team/published${buildQueryString(params)}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'TeamMember' as const,
                id,
              })),
              'TeamMembers',
            ]
          : ['TeamMembers'],
    }),

    deleteTeamMember: builder.mutation<{ message: string }, string>({
      query: (memberId) => ({
        url: `/team/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, memberId) => [
        { type: 'TeamMember', id: memberId },
        'TeamMembers',
      ],
    }),

    toggleTeamMemberPublish: builder.mutation<
      { message: string; data: { id: string; isPublished: boolean } },
      string
    >({
      query: (memberId) => ({
        url: `/team/${memberId}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, memberId) => [
        { type: 'TeamMember', id: memberId },
        'TeamMembers',
      ],
    }),
  }),
});

export const {
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useGetTeamMemberByIdQuery,
  useGetAllTeamMembersQuery,
  useGetPublishedTeamMembersQuery,
  useDeleteTeamMemberMutation,
  useToggleTeamMemberPublishMutation,

  useLazyGetAllTeamMembersQuery,
  useLazyGetTeamMemberByIdQuery,
} = teamMemberApi;
