import Order from '../models/order.js'
import Product from '../models/product.js'
import asyncHandler from 'express-async-handler'
import snap from '../config/midtrans.js';
import moment from 'moment'

function calcPrice(orderItems) {
    const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = itemsPrice <= 100 ? 1 : itemsPrice <= 500 ? 5 : itemsPrice < 1000 ? 8 : 10;
    const totalPrice = Math.round(itemsPrice + shippingPrice + taxPrice)

    return {
        itemsPrice: Math.round(itemsPrice), 
        shippingPrice: Math.round(shippingPrice),
        taxPrice: Math.round(taxPrice),
        totalPrice,
    }
}

export const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    console.log('Request Body:', req.body);

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x._id) },
    });

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
    });

    const { itemsPrice, taxPrice, shippingPrice } = calcPrice(dbOrderItems);
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentStatus: 'pending'
    })

    const createdOrder = await order.save()
    const orderId = createdOrder.id
    console.log('orderid:', orderId)
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
            ...(taxPrice > 0 ? [{
                id: 'TAX',
                price: taxPrice, 
                quantity: 1,
                name: 'Tax'
            }] : []),
            ...(shippingPrice > 0 ? [{
                id: 'SHIPPING',
                price: shippingPrice,
                quantity: 1,
                name: 'Shipping Fee'
            }] : [])
        ]
    };

    try {
        const response = await snap.createTransaction(orderDetails);
        console.log('Midtrans Response:', response);

        if (!response.token) {
            throw new Error('Midtrans did not return a payment token');
        }

        createdOrder.paymentToken = response.token
        createdOrder.paymentUrl = response.redirect_url
        await createdOrder.save();

        console.log('Order Created:', createdOrder)

        await Promise.all(dbOrderItems.map(item =>
            Product.findByIdAndUpdate(item.product, {
                $inc: { countInStock: -item.qty }
            })
        ));

        res.status(201).json({
            order: createdOrder,
            token: response.token,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
});

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
              $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
            },
            totalSales: { $sum: "$totalPrice" },
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
    const order = await Order.findById(req.params.id);

    if (order) {
        const { status, updatedAt, id } = req.body; 

        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            status,
            update_time: updatedAt,
            id,
        };

        const updatedOrder = await order.save();
        console.log('updatedORder', updatedOrder);
        
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
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

// export const callbackPayment = asyncHandler(async (req, res) => {
//     try {
//         const statusResponse = await snap.transaction.notification(req.body);

//         const orderId = statusResponse.order_id;
//         const transactionStatus = statusResponse.transaction_status;
//         const fraudStatus = statusResponse.fraud_status;

//         const orderData = await Order.findById(orderId);
//         if (!orderData) {
//             res.status(404);
//             throw new Error("Order not found");
//         }

//         if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
//             if (fraudStatus === 'accept') {
//                 orderData.status = 'success';
//             }
//         } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
//             orderData.status = 'failed';
//         } else if (transactionStatus === 'pending') {
//             orderData.status = 'pending';
//         }

//         await orderData.save();

//         return res.status(200).json({ message: 'Payment status updated', status: orderData.status });
//     } catch (error) {
//         console.error("Error handling Midtrans callback:", error);
//         return res.status(500).json({ message: 'Payment callback failed', error: error.message });
//     }
// });