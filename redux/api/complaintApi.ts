import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ImageVerificationData } from "../slices/complaintSlice";

export const complaintApi = createApi({
  reducerPath: "complaintApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Complaints"],
  endpoints: (builder) => ({
    createComplaint: builder.mutation<
      {
        status: string;
        message: string;
        data: {
          _id: string;
          userId: string;
          description: string;
          imageUrl: string;
          location: {
            type: string;
            coordinates: [number, number];
            address: string | null;
          };
          category: string;
          severity: string;
          department: string;
          status: string;
          createdAt: string;
          updatedAt: string;
          resolvedAt: string | null;
           imageVerification?: ImageVerificationData | null;  // ← ADD to each
        };
      },
      FormData
    >({
      query: (formData) => ({
        url: "/complaints",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Complaints"],
    }),

    getComplaints: builder.query<
      {
        status: string;
        data: {
          complaints: Array<{
            _id: string;
            userId: string;
            description: string;
            imageUrl: string;
            location: {
              type: string;
              coordinates: [number, number];
              address: string | null;
            };
            category?: string;
            severity?: string;
            department?: string;
            status: string;
            createdAt: string;
            updatedAt: string;
            resolvedAt: string | null;
             imageVerification?: ImageVerificationData | null;  // ← ADD to each
          }>;
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      },
      void
    >({
      query: () => "/complaints",
      providesTags: ["Complaints"],
    }),

    getComplaintById: builder.query<
      {
        status: string;
        data: {
          _id: string;
          userId: string;
          description: string;
          imageUrl: string;
          location: {
            type: string;
            coordinates: [number, number];
            address: string | null;
          };
          category: string;
          severity: string;
          department: string;
          status: string;
          createdAt: string;
          updatedAt: string;
          resolvedAt: string | null;
           imageVerification?: ImageVerificationData | null;  // ← ADD to each
        };
      },
      string
    >({
      query: (id) => `/complaints/${id}`,
    }),
  }),
});

export const {
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
} = complaintApi;
