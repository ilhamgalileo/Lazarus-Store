import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState: [],
    reducers: {
        addToFavorites: (state, action) => {
            if (!state.some((product) => product._id === action.payload._id)) {
                state.push(action.payload)
            }
        },
        removeFromfavorites: (state, action) => {
            return state.filter((product) => product._id !== action.payload._id)
        },
        setFavorites: (state, action) => {
            return action.payload
        }
    }
})
export const {addToFavorites, removeFromfavorites, setFavorites} = favoriteSlice.actions
export const selectFavoritesProduct = (state) => state.favorites
export default favoriteSlice.reducer