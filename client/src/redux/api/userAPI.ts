import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { DeleteUserRequest, MessageResponse, UserResponse, allUserResponse } from "../../Types/api-types";
import { User } from "../../Types/types";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),

  tagTypes : ["users"],
  
  endpoints: (builder) => ({

    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags : ["users"],
    }), // login

    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({userId, adminUserId}) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags : ["users"],
    }),

    allUsers: builder.query<allUserResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags : ["users"],
    }), 

  }), // endpoints
});



export const getUser = async (id : string) =>{
    try {
        const { data } : { data : UserResponse} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
        return data; 
    } catch (error) {
      console.log("user not found");
        throw error;
    }
}



export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } = userAPI;


