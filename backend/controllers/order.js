import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import asyncHandler from 'express-async-handler';

function calcPrice(orderItems) {
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    )
  
    const shippingPrice = itemsPrice > 100 ? 0 : 10;

    let taxPrice;
    if (itemsPrice <= 100) {
      taxPrice = 1
    } else if (itemsPrice <= 500) {
      taxPrice = 5
    } else if (itemsPrice < 1000) {
      taxPrice = 8
    } else {
      taxPrice = 10
    }
  
    const totalPrice = (
      itemsPrice +
      shippingPrice +
      taxPrice
    ).toFixed(2)
  
    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice,
    }
  }

export const createOrder = asyncHandler(async (req, res) => {
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
            throw new Error(`Product not found: ${itemsFromClient._id}`)
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
})

export const getAllOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id username")
    res.json(orders)
})

export const getMyOrder = asyncHandler(async (req, res) => {
    const id = req.user._id
    const myOder = await Order.find({ user: id })
    res.json(myOder)
})

export const countTotalOrders = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments()
    res.json({ totalOrders })
})

export const calcTotalSales = asyncHandler(async (req, res) => {
    const orders = await Order.find()
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    res.json({ totalSales })
})

export const calcTotalSalesByDate = asyncHandler(async (req, res) => {
    const salesByDate = await Order.aggregate([
        {
            $match: {
                isPaid: true,
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '$Y-$M-%d', date: '$paidAt' }
                },
                totalSales: { $sum: '$totalSales' }
            },
        },
    ])
    res.json(salesByDate)
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
    const id = req.params.id
    const order = await Order.findById(id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updateOrder = await order.save()
        res.status(200).json(updateOrder)
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