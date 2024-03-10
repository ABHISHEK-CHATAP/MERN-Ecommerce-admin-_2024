import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BarResponse,
  LineResponse,
  PieResponse,
  StatsResponse,
} from "../../Types/api-types";

export const dashboardAPI = createApi({
  reducerPath: "dashboardAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
  }),

  tagTypes: ["dashboard"],

  endpoints: (builder) => ({
    stats: builder.query<StatsResponse, string>({
      query: (id) => `stats?id=${id}`,
      keepUnusedDataFor:0,
      providesTags: ["dashboard"],
    }),

    //  keepUnusedDataFor:0, => caching nhi hogi ab, 0 second ke liye he hhoga unused data:- realtime me data change hoga charts me

    pie: builder.query<PieResponse, string>({
      query: (id) => `pie?id=${id}`,
      keepUnusedDataFor:0,
      providesTags: ["dashboard"],
    }),

    bar: builder.query<BarResponse, string>({
      query: (id) => `bar?id=${id}`,
      keepUnusedDataFor:0,
      providesTags: ["dashboard"],
    }),

    line: builder.query<LineResponse, string>({
      query: (id) => `line?id=${id}`,
      keepUnusedDataFor:0,
      providesTags: ["dashboard"],
    }),
  }), // endpoints end
});

export const { useStatsQuery, usePieQuery, useBarQuery, useLineQuery } =
  dashboardAPI;
