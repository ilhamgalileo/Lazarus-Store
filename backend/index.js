const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

const cookieParser = require('cookie-parser')
const { connectDB } = require('./config/db')

dotenv.config() 
const port = process.env.PORT || 5000

connectDB()

const app = express()

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/products', require('./routes/product'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/orders', require('./routes/order'))
app.use('/api/users', require('./routes/user'))
app.use('/api/category', require('./routes/category'))
app.use('/api/upload', require('./routes/upload'))

app.use((req, res) => {
    res.status(404).json({ message: `${req.method} ${req.originalUrl} not found` })
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
