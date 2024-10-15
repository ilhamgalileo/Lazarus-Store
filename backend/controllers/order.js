import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import asyncHandler from 'express-async-handler';

function calcPrice(orderItems) {
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)

    const shippingPrice = itemsPrice > 100 ? 0 : 10
    const taxRate = 0.15
    const taxPrice = (itemsPrice * taxRate).toFixed(2)

    const totalPrice = (
        itemsPrice + shippingPrice + parseFloat(taxPrice).toFixed(2)
    )

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice,
        totalPrice
    }
}

export const createOrder = asyncHandler(async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body

        if (orderItems && orderItems.length === 0) {
            res.status(400)
            throw new Error("no order items")
        }

        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        })

        const dbOrderItems = orderItems.map((itemsFromClient) => {
            const matchingItemFromDB = itemsFromDB.find((itemsFromDB) => itemsFromDB._id.toString() ===
                itemsFromClient._id)

            if (!matchingItemFromDB) {
                res.status(404)
                throw new Error(`Product not found: ${itemFromClient._id}`)
            }

            return {
                ...itemsFromClient,
                product: itemsFromClient._id,
                price: matchingItemFromDB.price,
                _id: undefined,
            }
        })
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrice(dbOrderItems)

        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
        const createOrder = await order.save()
        res.status(201).json(createOrder)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

export const getAllOrder = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id username")
        res.json(orders)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export const getMyOrder = asyncHandler(async (req, res) => {
    try {
        const id = req.user._id
        const myOder = await Order.find({ user: id })
        res.json(myOder)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})