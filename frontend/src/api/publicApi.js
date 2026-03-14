// src/redux/adminApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
   
   tagTypes: ['Projects','Experience'],
  endpoints: (builder) => ({

   
   contactAdmin: builder.mutation({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data,
      }),
     }),

    getProjects: builder.query({
      query: () => '/projects',
      providesTags: ['Projects'],
    }),

    getWorkExperience:builder.query({
      query: () => '/experience',
      providesTags: ['Experience'],
    })

 
   
  }),
});

export const {
 useContactAdminMutation,
 useAdminDataQuery,
 useGetProjectsQuery,
 useGetWorkExperienceQuery

} = publicApi;