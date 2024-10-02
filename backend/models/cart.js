import mongoose from "mongoose"

const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true },
        quantity: { type: Number, require: true }
    }]
},
    {
        timestamps: true
    })
const Cart = mongoose.model("Cart", schema)
export default Cart