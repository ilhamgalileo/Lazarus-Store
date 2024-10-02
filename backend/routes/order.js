import express  from 'express'
const router = express.Router()
import { authenticate } from '../middlewares/middleware.js'
import * as order  from '../controllers/order.js'


router.post('/:cartId', authenticate, order.checkout) // Checkout menggunakan cartId

export default router