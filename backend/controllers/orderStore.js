import asyncHandler from 'express-async-handler'
import Product from "../models/product.js";
import snap from "../config/midtrans.js";
import OrderStore from "../models/orderStore.js";

function calcPrice(orderItems) {
    const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    )
    const subtotal = itemsPrice
    const taxPrice = Math.round(subtotal * 0.11)
    const totalPrice = Math.round(subtotal + taxPrice)

    return {
        itemsPrice: Math.round(itemsPrice),
        taxPrice: Math.round(taxPrice),
        totalPrice,
    }
}

export const createInStoreOrder = asyncHandler(async (req, res) => {
    const { orderItems, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemsFromClient, index) => {
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
            key: index,
        };
    });

    const { itemsPrice, taxPrice, totalPrice } = calcPrice(dbOrderItems);

    const order = new OrderStore({
        orderItems: dbOrderItems,
        user: req.user._id,
        paymentMethod,
        itemsPrice,
        taxPrice,
        totalPrice,
    });

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
        },
        item_details: dbOrderItems.map((item) => ({
            id: item.product,
            price: item.price,
            quantity: item.qty,
            name: item.name,
        }))
    };

    if (taxPrice > 0) {
        orderDetails.item_details.push({
            id: 'TAX',
            price: taxPrice,
            quantity: 1,
            name: 'PPN 11%'
        });
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
        console.error('Error creating in-store order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
});

export const markOrderIsPay = asyncHandler(async (req, res) => {
    const order = await OrderStore.findById(req.params.id)

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
        res.status(404)
        throw new Error('Order not found')
    }
})

export const getAllStoreOrder = asyncHandler(async (req, res) => {
    const orderStore = await OrderStore.find({}).populate("user", "id username");
    res.json(orderStore);
})

export const findOrderById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const order = await OrderStore.findById(id).populate("user", "username")
    if (order) {
        res.json(order)
    } else {
        res.status(404).json("order not found")
    }
})

export const markOrderAsReturned = asyncHandler(async (req, res) => {
    const order = await OrderStore.findById(req.params.id);
  
    if (order) {
        if (!order.isPaid) {
            res.status(400)
            throw new Error('Order has not valid');
        }
  
        if (order.isPaid === false) {
            res.status(400)
            throw new Error('Order has already been returned');
        }
  
        await Promise.all(order.orderItems.map(async (item) => {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock += item.qty
                await product.save()
            } else {
                res.status(404);
                throw new Error(`Product not found: ${item.product}`);
            }
        }))
  
        order.isPaid = false
  
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
  })