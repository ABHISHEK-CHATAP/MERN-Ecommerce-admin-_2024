import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    AllOrdersResponse,
    MessageResponse,
    newOrderRequest,
    orderDetailResponse,
    updateOrderRequest,
} from "../../Types/api-types";

export const orderAPI = createApi({
  reducerPath: "orderApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),

  tagTypes: ["orders"],

  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponse, newOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),

    myOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => `my?id=${id}`,
      providesTags: ["orders"],
    }),

    allOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["orders"],
    }),

    orderDetails: builder.query<orderDetailResponse, string>({
      query: (id) => id,
      providesTags: ["orders"],
    }),

    updateOrder: builder.mutation<MessageResponse, updateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),

    deleteOrder: builder.mutation<MessageResponse, updateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
    
  }), // endpoints end
});

export const {
  useNewOrderMutation,
  useMyOrdersQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderAPI;
