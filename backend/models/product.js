import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema

const reviewSchema = mongoose.Schema({
    name: { type: String, require: true },
    rating: { type: Number, require: true },
    comment: { type: String, require: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
    }
}, {
    timestamps: true
})

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true }
}, {
    timestamps: true
})
const Product = mongoose.model('Product', productSchema)

export default Product 