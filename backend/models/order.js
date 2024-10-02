import mongoose from "mongoose"

const schema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
  },
    {
      timestamps: true
    })
  const Order = mongoose.model("Order", schema)
  export default Order 
