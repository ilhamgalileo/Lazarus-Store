// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Utiles
import connectDB from "./config/db.js";
import user from "./routes/user.js";
import category from "./routes/category.js";
import product from "./routes/product.js";
import upload from "./routes/upload.js";
import order from "./routes/order.js";
import cashOrder from "./routes/cashOrder.js"

dotenv.config()
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/users", user)
app.use("/api/category", category)
app.use("/api/products", product)
app.use("/api/uploads", upload)
app.use("/api/orders", order)
app.use("/api/orders/cash", cashOrder)

const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname + "/uploads")))

app.listen(port, () => console.log(`Server running on port: ${port}`))