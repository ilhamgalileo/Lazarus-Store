import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCate: builder.mutation({
            query: (newCategory) => ({
                url: `${CATEGORY_URL}`,
                method: "POST",
                body: newCategory,
            }),
        }),

        updateCate: builder.mutation({
            query: ({ categoryId, updatedCate }) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "PUT",
                body: updatedCate,
            }),
        }),

        deleteCate: builder.mutation({
            query: (categoryId) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "DELETE",
            }),
        }),

        fetchCate: builder.query({
            query:() => `${CATEGORY_URL}/list`
        })
    }),
})

export const { 
    useCreateCateMutation, 
    useUpdateCateMutation, 
    useDeleteCateMutation, 
    useFetchCateQuery } = categoryApiSlice