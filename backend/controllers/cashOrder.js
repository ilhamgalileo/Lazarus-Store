import asyncHandler from "../middlewares/asyncHandler.js";
import CashOrder from "../models/cashOrder.js";
import Product from "../models/product.js";
import Order from '../models/order.js'
// import { findAllCashOrders } from "./helper/orderHelper.js";

export const createCashOrder = async (req, res) => {
  const {
    customerName,
    phone,
    cust_address,
    orderItems,
    receivedAmount,
    shippingPrice,
    taxPrice,
    totalAmount,
  } = req.body;

  if (!customerName || !phone || !cust_address || !orderItems || !receivedAmount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Validasi items dan hitung total
    const validatedItems = [];
    let calculatedTotal = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found with ID: ${item.product}`,
        });
      }

      // Verifikasi harga dengan database
      if (product.price !== item.price) {
        return res.status(400).json({
          message: `Invalid price for product: ${product.name}`,
        });
      }

      calculatedTotal += product.price * item.quantity;

      validatedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });
    }

    calculatedTotal += shippingPrice + taxPrice;

    if (Math.abs(calculatedTotal - totalAmount) > 1) {
      return res.status(400).json({
        message: "Total amount mismatch",
      });
    }

    if (receivedAmount < totalAmount) {
      return res.status(400).json({
        message: "Received amount must be greater than or equal to total amount",
      });
    }

    // Buat order
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
      isPaid: true, // Tandai pesanan sebagai sudah dibayar
      paidAt: new Date(), // Catat waktu pembayaran
    });

    for (const item of validatedItems) {
      const product = await Product.findById(item.product);
      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product: ${product.name}`,
        });
      }
      product.countInStock -= item.quantity;
      await product.save();
    }

    res.status(201).json({
      _id: cashOrder._id,
      message: "Order created successfully",
      order: cashOrder,
    });
  } catch (error) {
    console.error("Create cash order error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

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