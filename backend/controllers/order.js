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

export const checkout = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { cartId } = req.params;

    const cart = await Cart.findOne({ _id: cartId, userId }).populate('products.productId', 'name price stock');
    if (!cart || cart.products.length === 0) {
        return res.status(404).send({ message: 'Cart is empty or not found' });
    }

    const products = cart.products.map(p => ({
        productId: p.productId._id,
        name: p.productId.name,
        quantity: p.quantity,
        price: p.productId.price,
    }));

    const totalAmount = products.reduce((total, p) => total + p.price * p.quantity, 0);

    for (const p of cart.products) {
        const product = await Product.findById(p.productId._id);
        if (product.stock < p.quantity) {

            return res.status(400).send({ message: `Stok ${product.name} tidak mencukupi` });
        }
    }

    const order = new Order({
        userId,
        products,
        totalAmount,
    });

    await order.save();

    for (const p of cart.products) {
        const product = await Product.findById(p.productId._id);
        product.stock -= p.quantity;
        await product.save();
    }

    await Cart.findByIdAndDelete(cart._id);

    res.status(201).send({ message: 'Checkout successful', order });
});
