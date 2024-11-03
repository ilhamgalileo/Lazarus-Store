import { apiSlice } from "./apiSlice";
import {  ORDERS_URL, MIDTRANS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: `${ORDERS_URL}/checkout`,
                method: 'POST',
                body: order
            }),
        }),

        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`
            }),
        }),

        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: "PUT",
                body: {
                    status: details.status,
                    updatedAt: details.updatedAt,
                    id: details.id,
                    payment_type: details.payment_type
                }
            }),
        }),

        getMidtransToken: builder.mutation({
            query: (orderId) => ({
                url: `${MIDTRANS_URL}/${orderId}/token`,
                method: 'POST'
            }),
        }),

        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`
            }),
        }),

        getOrders : builder.query ({
            query: () => ({
                url: ORDERS_URL
            }),
        }),

        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: "PUT",
            }),
        }),

        getTotalOrder: builder.query({
            query: () => `${ORDERS_URL}/total-orders`
        }),

        getTotalSales: builder.query({
            query: () => `${ORDERS_URL}/total-sales`
        }),

        getTotalSalesByDate: builder.query({
            query: () => `${ORDERS_URL}/total-sales-by-date`
        }),
    }),
})

export const {
    useCreateOrderMutation,
    useDeliverOrderMutation,
    useGetMyOrdersQuery,
    useGetMidtransTokenMutation,
    useGetOrderDetailsQuery,
    useGetOrdersSalesByDateQuery,
    useGetTotalOrderQuery,
    useGetTotalSalesQuery,
    useGetTotalSalesByDateQuery,
    usePayOrderMutation,
    useGetOrdersQuery
} = orderApiSlice