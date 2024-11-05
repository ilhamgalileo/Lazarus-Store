import express from 'express'
const router = express.Router()
import { authenticate, authorizeAdmin } from '../middlewares/middleware.js'
import * as order from '../controllers/order.js'

router.post('/checkout', authenticate, order.createOrder)
router.get("/", authenticate, authorizeAdmin, order.getAllOrder)
router.get("/mine", authenticate, order.getMyOrder)
router.get('/total-orders', authenticate, order.countTotalOrders)
router.get('/total-sales', authenticate, order.calcTotalSales)
router.get('/total-sales-by-date', authenticate, order.calcTotalSalesByDate)
router.get('/:id', authenticate, order.findOrderById)
router.put('/:id/pay', authenticate, order.markOrderIsPay)
router.put('/:id/deliver', authenticate, authorizeAdmin, order.markOrderIsDeliver)

export default router