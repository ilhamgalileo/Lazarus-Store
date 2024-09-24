const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables')
        }

        await mongoose.connect(uri)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

// Inisialisasi model-model
const db = {
    mongoose,
    user: require('../models/user')(mongoose),
    product: require('../models/product')(mongoose),
    cart: require('../models/cart')(mongoose),
    order: require('../models/order')(mongoose)
}

module.exports = { db, connectDB, connectDBtesting}
