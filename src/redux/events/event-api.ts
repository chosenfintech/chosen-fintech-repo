// src/redux/events/event-api.ts
import { apiSlice } from '../api-slice';
import {
  IEventResponse,
  IEventsPaginatedResponse,
  IEventsQueryParams,
  IEvent,
  IToggleEventResponse,
} from '@/types/events/event.types';

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new event
    createEvent: builder.mutation<IEventResponse, FormData>({
      query: (formData) => ({
        url: '/events',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        'Events',
        'Event',
        'Categories',
        'EventCategory',
        'EventCategoryStats',
      ],
    }),

    updateEvent: builder.mutation<
      IEventResponse,
      { eventId: string; formData: FormData }
    >({
      query: ({ eventId, formData }) => ({
        url: `/events/${eventId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: 'Event', id: eventId },
        'Events',
        'Event',
        'Categories',
        'EventCategory',
        'EventCategoryStats',
      ],
    }),

    getEventByIdOrSlug: builder.query<IEventResponse & { data: IEvent }, string>({
      query: (identifier) => ({
        url: `/events/${identifier}`,
        method: 'GET',
      }),
      providesTags: (result, error, identifier) => [
        { type: 'Event', id: identifier },
      ],
    }),

    getAllEvents: builder.query<IEventsPaginatedResponse, IEventsQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();
        return {
          url: `/events${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Event' as const, id })),
              'Events',
            ]
          : ['Events'],
    }),

    deleteEvent: builder.mutation<{ message: string }, string>({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, eventId) => [
        { type: 'Event', id: eventId },
        'Events',
        'Event',
        'Categories',
        'EventCategory',
        'EventCategoryStats',
      ],
    }),

    toggleEventPublish: builder.mutation<IToggleEventResponse, string>({
      query: (eventId) => ({
        url: `/events/${eventId}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Event',
        'Events',
        'Categories',
        'EventCategory',
        'EventCategoryStats',
      ],
    }),

    toggleEventFeatured: builder.mutation<IToggleEventResponse, string>({
      query: (eventId) => ({
        url: `/events/${eventId}/toggle-featured`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Events',
        'Event',
        'Categories',
        'EventCategory',
        'EventCategoryStats',
      ],
    }),

    getPublishedEvents: builder.query<
      IEventsPaginatedResponse,
      Omit<IEventsQueryParams, 'isPublished'>
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams({ isPublished: 'true' });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/events?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Events'],
    }),

    searchEvents: builder.query<
      IEventsPaginatedResponse,
      { search: string } & Omit<IEventsQueryParams, 'search'>
    >({
      query: ({ search, ...params }) => {
        const searchParams = new URLSearchParams({ search });

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/events?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Events'],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useUpdateEventMutation,
  useGetEventByIdOrSlugQuery,
  useGetAllEventsQuery,
  useDeleteEventMutation,
  useToggleEventPublishMutation,
  useToggleEventFeaturedMutation,
  useGetPublishedEventsQuery,
  useSearchEventsQuery,

  useLazyGetAllEventsQuery,
  useLazyGetEventByIdOrSlugQuery,
  useLazyGetPublishedEventsQuery,
  useLazySearchEventsQuery,
} = eventApi;
