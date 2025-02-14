import { isValidObjectId } from "mongoose";
import Order from "../models/order.js";

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid Object of: ${req.params.id}`)
  }
  next()
}

export const checkUserPurchase = async (req, res, next) => {
  const { id: productId } = req.params
  const userId = req.user._id
  const isAdmin = req.user.isAdmin

  if (isAdmin) {
    return res.status(403).json({ message: "Admin cannot leave reviews" });
  }
  try {
    const order = await Order.findOne({
      user: userId,
      "orderItems.product": productId,
      isPaid: true,
    });

    if (order) {
      next();
    } else {
      res.status(403).json({ message: "You must purchase the product to leave a review" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to check purchase", error: error.message });
  }
};

export default checkId