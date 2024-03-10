import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CategoriesResponse,
  CreateProductsRequest,
  MessageResponse,
  ProductResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  deleteProductsRequest,
  latestallProductResponse,
  updateProductsRequest,
} from "../../Types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),

  tagTypes : ["product"],

  endpoints: (builder) => ({

    latestProducts: builder.query<latestallProductResponse, string>({
      query: () => "latest",
      providesTags:["product"],
    }),

    allProducts: builder.query<latestallProductResponse, string>({
      query: (id) => `admin-products/?id=${id}`,
      providesTags:["product"],
    }),

    categories: builder.query<CategoriesResponse, string>({
      query: () => "categories",
      providesTags:["product"],
    }),

    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, search, sort, category, page }) => {
        let baseURL = `all?search=${search}&page=${page}`;

        if (price) baseURL += `&price=${price}`;
        if (sort) baseURL += `&sort=${sort}`;
        if (category) baseURL += `&category=${category}`;

        return baseURL;
      },
      providesTags:["product"],
    }),

     ProductDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags:["product"],
    }),

    createProducts: builder.mutation<MessageResponse, CreateProductsRequest>({
      query: ({formData, id}) => ({
        url : `new?id=${id}`,
        method : "POST",
        body : formData,
      }),
      invalidatesTags:["product"],
    }),

    updateProduct: builder.mutation<MessageResponse, updateProductsRequest>({
      query: ({formData, userId, productId}) => ({
        url : `${productId}?id=${userId}`,
        method : "PUT",
        body : formData,
      }),
      invalidatesTags:["product"],
    }),

    deleteProduct: builder.mutation<MessageResponse, deleteProductsRequest >({
      query: ({ userId, productId}) => ({
        url : `${productId}?id=${userId}`,
        method : "DELETE",
      }),
      invalidatesTags:["product"],
    }),

  }), // endpoints end
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useProductDetailsQuery,
  useCreateProductsMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
