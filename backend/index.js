const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./config/db')

dotenv.config() // Memuat variabel lingkungan dari file .env
const port = process.env.PORT || 5000

// Menghubungkan ke database
connectDB()

const app = express()

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Menangani rute yang tidak ditemukan
require('./routes/product')(app)
require('./routes/cart')(app)
require('./routes/order')(app)
require('./routes/user')(app)
app.use((req, res) => {
    res.status(404).json({ message: `${req.method} ${req.originalUrl} not found` })
})

// Mengatur port dan memulai server
app.listen(port, () => console.log(`Server running on port ${port}...`))
