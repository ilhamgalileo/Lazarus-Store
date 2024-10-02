import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

import User from '../models/user.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import Order from '../models/order.js';

const db = {
    mongoose,
    user: User(mongoose),
    product: Product(mongoose),
    cart: Cart(mongoose),
    order: Order(mongoose),
};

export default connectDB
