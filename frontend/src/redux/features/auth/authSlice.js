import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
    token: localStorage.getItem("token") || null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredientials: (state, action) => {
      state.userInfo = action.payload
      state.token = action.payload.token
      localStorage.setItem("userInfo", JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.userInfo = null
      state.token = null
      localStorage.removeItem("userInfo")
      localStorage.removeItem("token")
    },
  },
})

export const { setCredientials, logout } = authSlice.actions

export default authSlice.reducer