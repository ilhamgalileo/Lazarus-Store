  import { apiSlice } from "./apiSlice";
  import { USERS_URL } from "../constants";
  import Profile from "../../pages/user/Profile";

  const user = localStorage.getItem('userInfo')
  const userInfo = JSON.parse(user)
  const token = userInfo.token;

  export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}/auth`,
          method: "POST",
          body: data,
        }),
      }),

      logout: builder.mutation({
        query: () => ({
          url: `${USERS_URL}/logout`,
          method: "POST",
        }),
      }),

      Register: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}/register`,
          method: "POST",
          body: data,
        }),
      }),

      Profile: builder.mutation({
        query: (data) =>({
          url:  `${USERS_URL}/profile`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: data,
        })
      })
    }),
  });

  export const { 
    useLoginMutation,
    useLogoutMutation, 
    useRegisterMutation,
    useProfileMutation,
  } = userApiSlice;