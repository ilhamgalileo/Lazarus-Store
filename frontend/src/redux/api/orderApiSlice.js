import { apiSlice } from "./apiSlice";
import { ORDERS_URL, MIDTRANS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: `${ORDERS_URL}/checkout`,
                method: 'POST',
                body: order
            }),
        }),

        createCashOrder: builder.mutation({
            query: (cashOrder) => ({
                url: `${ORDERS_URL}/cash`,
                method: 'POST',
                body: cashOrder
            })
        }),

        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`
            }),
        }),

        getCashOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/cash/${id}`
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

        returnOrder: builder.mutation({
            query: ( orderId ) => ({
                url: `${ORDERS_URL}/${orderId}/return`,
                method: "PUT",
            }),
        }),

        returnCashOrder: builder.mutation({
            query: ( orderId ) => ({
                url: `${ORDERS_URL}/cash/${orderId}/return`,
                method: "PUT",
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

        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL
            }),
        }),

        getAllOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/all-orders`
            }),
            transformResponse: (response) => ({
                orders: response.orders || [],
                cashOrders: response.cashOrders || [],
            }),
        }),

        getCashOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/cash/all`
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
    useCreateCashOrderMutation,
    useDeliverOrderMutation,
    useGetMyOrdersQuery,
    useGetMidtransTokenMutation,
    useGetOrderDetailsQuery,
    useGetCashOrderDetailsQuery,
    useGetCashOrdersQuery,
    useGetOrdersSalesByDateQuery,
    useGetTotalOrderQuery,
    useGetTotalSalesQuery,
    useGetTotalSalesByDateQuery,
    usePayOrderMutation,
    useReturnOrderMutation,
    useGetOrdersQuery,
    useGetAllOrdersQuery,
    useReturnCashOrderMutation,
} = orderApiSlice