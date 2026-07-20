// src/redux/contact/contact-api.ts
import { apiSlice } from '../api-slice';
import type { IContactFormOutput } from '@/validations/contact-validation';

export interface ISendContactMessageResponse {
  message: string;
}

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /** Public enquiry - nothing is cached, so there are no tags to invalidate. */
    sendContactMessage: builder.mutation<
      ISendContactMessageResponse,
      IContactFormOutput
    >({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
