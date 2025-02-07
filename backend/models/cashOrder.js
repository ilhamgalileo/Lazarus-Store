import mongoose from "mongoose";

const cashOrderSchema = mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    receivedAmount: { type: Number, required: true },
    change: { type: Number, required: true },
    isDelivered: { type: Boolean, default: false },
    isPaid: {type: Boolean, default: false},
    deliveredAt: { type: Date },
    paymentMethod: { type: String, default: 'cash', required: true }
  },
  {
    timestamps: true,
  }
);

const CashOrder = mongoose.model("CashOrder", cashOrderSchema);
export default CashOrder
