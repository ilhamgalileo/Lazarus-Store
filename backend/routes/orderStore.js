import express from 'express'
const router = express.Router()
import { authenticate, authorizeAdmin } from '../middlewares/middleware.js'
import * as orderStore from '../controllers/orderStore.js'

router.post('/', authenticate, orderStore.createInStoreOrder)
router.put('/:id/pay', authenticate, orderStore.markOrderIsPay)
router.get('/:id', authenticate,authorizeAdmin, orderStore.findOrderById)

export default router