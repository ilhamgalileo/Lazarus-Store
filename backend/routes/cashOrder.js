import express from 'express'
const router = express.Router()
import { authorizeAdmin, authenticate, superAdminAuth } from '../middlewares/middleware.js'
import * as cashOrder from '../controllers/cashOrder.js'

router.post('/', authenticate, authorizeAdmin, cashOrder.createCashOrder)
router.get('/all', authenticate, authorizeAdmin, cashOrder.getAllOrderCash)
router.get('/:id', authenticate, authorizeAdmin, cashOrder.getCashOrderById)
router.put('/:id/return', authenticate, superAdminAuth, cashOrder.markOrderAsReturned)

export default router