// src/redux/projects/project-api.ts
import { apiSlice } from '../api-slice';
import {
  IProjectResponse,
  IProjectsPaginatedResponse,
  IProjectsQueryParams,
  IProject,
  IToggleProjectResponse,
} from '@/types/projects/project.types';

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new project
    createProject: builder.mutation<IProjectResponse, FormData>({
      query: (formData) => ({
        url: '/projects',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        'Projects',
        'Project',
        'Categories',
      ],
    }),

    updateProject: builder.mutation<
      IProjectResponse,
      { projectId: string; formData: FormData }
    >({
      query: ({ projectId, formData }) => ({
        url: `/projects/${projectId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Project', id: projectId },
        'Projects',
        'Project',
        'Categories',
      ],
    }),

    getProjectByIdOrSlug: builder.query<IProjectResponse & { data: IProject }, string>({
      query: (identifier) => ({
        url: `/projects/${identifier}`,
        method: 'GET',
      }),
      providesTags: (result, error, identifier) => [
        { type: 'Project', id: identifier },
      ],
    }),

    getAllProjects: builder.query<IProjectsPaginatedResponse, IProjectsQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();
        return {
          url: `/projects${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Project' as const, id })),
              'Projects',
            ]
          : ['Projects'],
    }),

    deleteProject: builder.mutation<{ message: string }, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, projectId) => [
        { type: 'Project', id: projectId },
        'Projects',
        'Project',
        'Categories',
      ],
    }),

    toggleProjectPublish: builder.mutation<IToggleProjectResponse, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Project',
        'Projects',
        'Categories',
      ],
    }),

    toggleProjectFeatured: builder.mutation<IToggleProjectResponse, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/toggle-featured`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Projects',
        'Project',
        'Categories',
      ],
    }),

    getPublishedProjects: builder.query<
      IProjectsPaginatedResponse,
      Omit<IProjectsQueryParams, 'isPublished'>
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams({ isPublished: 'true' });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/projects?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Projects'],
    }),

    searchProjects: builder.query<
      IProjectsPaginatedResponse,
      { search: string } & Omit<IProjectsQueryParams, 'search'>
    >({
      query: ({ search, ...params }) => {
        const searchParams = new URLSearchParams({ search });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/projects?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Projects'],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetProjectByIdOrSlugQuery,
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
  useToggleProjectPublishMutation,
  useToggleProjectFeaturedMutation,
  useGetPublishedProjectsQuery,
  useSearchProjectsQuery,

  useLazyGetAllProjectsQuery,
  useLazyGetProjectByIdOrSlugQuery,
  useLazyGetPublishedProjectsQuery,
  useLazySearchProjectsQuery,
} = projectApi;
