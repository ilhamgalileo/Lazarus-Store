import asyncHandler from "../middlewares/asyncHandler.js";
import CashOrder from "../models/cashOrder.js";
import Product from "../models/product.js";

export const createCashOrder = async (req, res) => {
  const {
    customerName,
    phone,
    cust_address,
    orderItems,
    receivedAmount,
    shippingPrice,
  } = req.body

  if (!customerName || !phone || !cust_address || !orderItems || !receivedAmount) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    const validatedItems = []
    let calculatedTotal = 0

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found with ID: ${item.product}`,
        })
      }

      if (product.price !== item.price) {
        return res.status(400).json({
          message: `Invalid price for product: ${product.name}`,
        })
      }

      calculatedTotal += product.price * item.quantity

      validatedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      })
    }

    const totalAmountBeforeTax = calculatedTotal + shippingPrice

    const taxPrice = 0.11 * totalAmountBeforeTax

    const totalAmount = totalAmountBeforeTax + taxPrice

    if (receivedAmount < totalAmount) {
      return res.status(400).json({
        message: "Received amount must be greater than or equal to total amount",
      })
    }

    const cashOrder = await CashOrder.create({
      customerName,
      phone,
      address: cust_address,
      items: validatedItems,
      shippingPrice,
      taxPrice,
      totalAmount,
      receivedAmount,
      change: receivedAmount - totalAmount,
      isPaid: true,
      paidAt: new Date(),
    })

    for (const item of validatedItems) {
      const product = await Product.findById(item.product);
      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product: ${product.name}`,
        })
      }
      product.countInStock -= item.quantity;
      await product.save();
    }

    res.status(201).json({
      _id: cashOrder._id,
      message: "Order created successfully",
      order: cashOrder,
      taxPrice,
      totalAmount,
    })
  } catch (error) {
    console.error("Create cash order error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    })
  }
}

export const getAllOrderCash = asyncHandler(async (req, res) => {
  const orders = await CashOrder.find({}).populate("items.product", "name");
  res.json({ orders });
})

export const getCashOrderById = asyncHandler(async (req, res) => {
  const id = req.params.id
  const data = await CashOrder.findById(id).populate("items.product", "name price images");

  if (data) {
    res.send(data)
  } else {
    res.status(500).send({ message: 'Order not found with id ' + id })
  }
})

export const markOrderAsReturned = asyncHandler(async (req, res) => {
  const order = await CashOrder.findById(req.params.id);

  if (order) {
      if (!order.isPaid) {
          res.status(400)
          throw new Error('Order has not valid');
      }

      if (order.isPaid === false) {
          res.status(400)
          throw new Error('Order has already been returned');
      }

      await Promise.all(order.items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (product) {
              product.countInStock += item.quantity
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