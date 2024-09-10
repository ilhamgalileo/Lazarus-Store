import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apislice";
import { defaultFormat } from "moment/moment";

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefualtMiddleware) =>
        getDefualtMiddleware().concat(apiSlice.middleware),
        devTools: true,
})
setupListeners(store.dispatch)
export default store;
