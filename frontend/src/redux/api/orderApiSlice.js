import { apiSlice } from "./apiSlice";
import { PAYPAL_URL, ORDERS_URL } from "../constants";

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
                body: details
            }),
        }),

        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL
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
                url: `${ORDERS_URL}/${orderId}/deliver`
            }),
        }),

        getTotalOrder: builder.query({
            query: () => `${ORDERS_URL}/total-orders`
        }),

        getTotalSales: builder.query({
            query: () => `${ORDERS_URL}/total-sales`
        }),

        getOrdersSalesByDate: builder.query({
            query: () => `${ORDERS_URL}/total-sales-by-date`
        }),
    }),
})

export const {
    useCreateOrderMutation,
    useDeliverOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery,
    useGetOrdersSalesByDateQuery,
    useGetPaypalClientIdQuery,
    useGetTotalOrderQuery,
    useGetTotalSalesQuery,
    usePayOrderMutation,
    useGetOrdersQuery
} = orderApiSlice