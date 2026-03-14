// src/redux/adminApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ADMIN_API_URL,
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

    registerAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/signup',
        method: 'POST',
        body: credentials,
      }),
    }),

    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

   
    createProject: builder.mutation({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Projects'],
    }),

    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Projects'],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),

    projectById:builder.query({
      query:(id)=>({
        url:`/projects/${id}`,
        method:'GET'
      }),
      invalidatesTags: ['Projects'],
    }),

    getMessages:builder.query({
      query:()=>({
         url:'/messages',
         method:'GET'
      })
    }),

    markMessageRead:builder.mutation({
      query:(id)=>({
        url:`/message/${id}/read`,
        method:'PATCH'
      })
    }),

    deleteMessage:builder.mutation({
        query:(id)=>({
        url:`/message/${id}`,
        method:'DELETE'
      })
    }),

   
    // CREATE EXPERIENCE
    createExperience: builder.mutation({
      query: (data) => ({
        url: "/experience",
        method: "POST",
        body: data
      }),

      invalidatesTags: ["Experience"]
    }),

    // UPDATE EXPERIENCE
    updateExperience: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/experience/${id}`,
        method: "PUT",
        body: data
      }),

      invalidatesTags: ["Experience"]
    }),

    // DELETE EXPERIENCE
    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `/experience/${id}`,
        method: "DELETE"
      }),

      invalidatesTags: ["Experience"]
    }),

    experienceById:builder.query({
      query:(id)=>({
        url:`/experience/${id}`,
        method:'GET'
      }),
      invalidatesTags: ['Experience'],
    }),




  }),
});

export const {
  useRegisterAdminMutation,
  useLoginAdminMutation,
  
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useProjectByIdQuery,
  useGetMessagesQuery,
  useMarkMessageReadMutation,
  useDeleteMessageMutation,
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceMutation,
  useExperienceByIdQuery
} = adminApi;