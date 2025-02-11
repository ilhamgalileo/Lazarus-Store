import Order from '../models/order.js'
import Product from '../models/product.js'
import asyncHandler from 'express-async-handler'
import snap from '../config/midtrans.js';
import CashOrder from '../models/cashOrder.js';
import OrderStore from '../models/orderStore.js';

function calcPrice(orderItems) {
    const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    )
    const shippingPrice = itemsPrice > 100 ? 0 : 10
    const subtotal = itemsPrice + shippingPrice
    const taxPrice = Math.round(subtotal * 0.11)
    const totalPrice = Math.round(subtotal + taxPrice)

    return {
        itemsPrice: Math.round(itemsPrice),
        shippingPrice: Math.round(shippingPrice),
        taxPrice: Math.round(taxPrice),
        totalPrice,
    }
}

export const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x._id) },
    })

    const dbOrderItems = orderItems.map((itemsFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
            (item) => item._id.toString() === itemsFromClient._id
        );

        if (!matchingItemFromDB) {
            res.status(404);
            throw new Error(`Product not found: ${itemsFromClient._id}`);
        }

        return {
            ...itemsFromClient,
            product: itemsFromClient._id,
            price: matchingItemFromDB.price,
            _id: undefined,
        }
    })

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrice(dbOrderItems);

    const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    })

    const createdOrder = await order.save();
    const orderId = createdOrder.id;

    const orderDetails = {
        transaction_details: {
            order_id: orderId,
            gross_amount: totalPrice,
        },
        customer_details: {
            first_name: req.user.username,
            email: req.user.email,
            billing_address: {
                first_name: req.user.username,
                city: shippingAddress.city,
                country: shippingAddress.country,
            },
            shipping_address: {
                first_name: req.user.username,
                address: shippingAddress.address,
                city: shippingAddress.city,
                postal_code: shippingAddress.postalCode,
            },
        },
        item_details: [
            ...dbOrderItems.map((item) => ({
                id: item.product,
                price: item.price,
                quantity: item.qty,
                name: item.name,
            })),
            {
                id: 'TAX',
                price: taxPrice,
                quantity: 1,
                name: 'PPN 11%'
            },
            ...(shippingPrice > 0 ? [{
                id: 'SHIPPING',
                price: shippingPrice,
                quantity: 1,
                name: 'Shipping Fee'
            }] : [])
        ]
    }

    try {
        const response = await snap.createTransaction(orderDetails);

        if (!response.token) {
            throw new Error('Midtrans did not return a payment token');
        }

        createdOrder.paymentToken = response.token;
        createdOrder.paymentUrl = response.redirect_url;
        await createdOrder.save();

        res.status(201).json({
            order: createdOrder,
            token: response.token,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
})

export const getAllOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id username")
    res.json(orders)
})

export const getAllCombinedOrders = asyncHandler(async (req, res) => {
    const [orders, cashOrders, orderStore] = await Promise.all([
        Order.find({}).populate("user", "id username"),
        CashOrder.find({}).populate("items.product", "name price images"),
        OrderStore.find({}).populate("user", "id username"),
    ])

    res.json({
        orders,
        cashOrders,
        orderStore
    })
})

export const getMyOrder = asyncHandler(async (req, res) => {
    const id = req.user._id
    const myOder = await Order.find({ user: id })
    res.json(myOder)
})

export const countTotalOrders = asyncHandler(async (req, res) => {
    const [totalTransferOrders, totalCashOrders, totalOrderStore] = await Promise.all([
        Order.countDocuments(),
        CashOrder.countDocuments(),
        OrderStore.countDocuments(),
    ]);

    const totalCombinedOrders = totalTransferOrders + totalCashOrders + totalOrderStore;

    res.json({ totalOrders: totalCombinedOrders })
})

export const calcTotalSales = asyncHandler(async (req, res) => {
    const [orders, cashOrders, storeOrders] = await Promise.all([
        Order.find({ isPaid: true }),
        CashOrder.find({ isPaid: true }),
        OrderStore.find({ isPaid: true }),
    ])

    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0) +
        cashOrders.reduce((sum, cashOrder) => sum + cashOrder.totalAmount, 0) +
        storeOrders.reduce((sum, storeOrders) => sum + storeOrders.totalPrice, 0)

    res.json({ totalSales })
})

export const calcTotalSalesByDate = asyncHandler(async (req, res) => {
    const [salesByDateOrder, salesByDateStoreOrder, salesByDateCashOrder] = await Promise.all([
        Order.aggregate([
            {
                $match: { isPaid: true },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
                    },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
        ]),
        OrderStore.aggregate([
            {
                $match: { isPaid: true },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
                    },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
        ]),
        CashOrder.aggregate([
            {
                $match: { isPaid: true },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    totalSales: { $sum: "$totalAmount" },
                },
            },
        ]),
    ]);

    const mergedSales = [...salesByDateOrder, ...salesByDateStoreOrder, ...salesByDateCashOrder].reduce((acc, sale) => {
        const existing = acc.find(item => item._id === sale._id);
        if (existing) {
            existing.totalSales += sale.totalSales;
        } else {
            acc.push(sale);
        }
        return acc;
    }, [])

    res.json(mergedSales)
})

export const findOrderById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const order = await Order.findById(id).populate("user", "username email")
    if (order) {
        res.json(order)
    } else {
        res.status(404).json("order not found")
    }
})

export const markOrderIsPay = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        const { status, updatedAt, id, payment_type } = req.body

        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentMethod = payment_type
        order.paymentResult = {
            status,
            update_time: updatedAt,
            id,
        }

        await Promise.all(order.orderItems.map(async (item) => {
            const product = await Product.findById(item.product)
            if (product) {
                product.countInStock -= item.qty

                if (product.countInStock < 0) {
                    res.status(400);
                    throw new Error(`Stock insufficient for product: ${product.name}`)
                }

                await product.save()
            } else {
                res.status(404);
                throw new Error(`Product not found: ${item.product}`)
            }
        }))

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404);
        throw new Error('Order not found')
    }
})

export const markOrderAsReturned = asyncHandler(async (req, res) => {
    const order = await Store.findById(req.params.id)

    if (order) {
        if (!order.isPaid) {
            res.status(400)
            throw new Error('Order has not been paid yet')
        }

        if (order.isReturned) {
            res.status(400);
            throw new Error('Order has already been returned')
        }

        await Promise.all(order.orderItems.map(async (item) => {
            const product = await Product.findById(item.product)
            if (product) {
                product.countInStock += item.qty
                await product.save()
            } else {
                res.status(404)
                throw new Error(`Product not found: ${item.product}`)
            }
        }))

        order.isPaid = false
        order.isDelivered = false

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

export const markOrderIsDeliver = asyncHandler(async (req, res) => {
    const id = req.params.id

    const order = await Order.findById(id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404).json('order not found')
    }
})