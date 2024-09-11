import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null, // This will store user information including username
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload
    },
    logout: (state) => {
      state.userInfo = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer