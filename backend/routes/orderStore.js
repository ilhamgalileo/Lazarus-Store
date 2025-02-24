import express from 'express'
const router = express.Router()
import { authenticate, authorizeAdmin, superAdminAuth } from '../middlewares/middleware.js'
import * as orderStore from '../controllers/orderStore.js'

router.get('/all', authenticate,authorizeAdmin, orderStore.getAllStoreOrder)
router.post('/', authenticate, orderStore.createInStoreOrder)
router.put('/:id/pay', authenticate, orderStore.markOrderIsPay)
router.get('/:id', authenticate,authorizeAdmin, orderStore.findOrderById)
router.put('/:id/return', authenticate, superAdminAuth, orderStore.markOrderAsReturned)

export default router