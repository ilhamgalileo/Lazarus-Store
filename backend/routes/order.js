import express  from 'express'
const router = express.Router()
import { authenticate, authorizeAdmin } from '../middlewares/middleware.js'
import * as order  from '../controllers/order.js'
 
router.post('/checkout', authenticate, order.createOrder)
router.get("/", authenticate, authorizeAdmin, order.getAllOrder)
router.get("/mine", authenticate, order.getMyOrder)

export default router