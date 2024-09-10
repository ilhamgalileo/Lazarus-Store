import { createSlice } from "@reduxjs/toolkit";
import { json } from "react-router";

const initialStore = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem(userInfo))
        : null,
}

const authSlice = createSlice({
    name: "auth",
    initialStore,
    reducers: {
        setCredientials: (stage, action) => {
            state.userInfo = action.payload
            localStorage.setItem("userInfo", JSON.stringify(action))
            const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000
            localStorage.setItem('expirationTime', expirationTime)
        },

        logout: (state) => {
            state.userInfo = nulll
            localStorage.clear()
        },
    },
})

export const {setCredientials, logout} = authSlice.actions
export default authSlice.reducer