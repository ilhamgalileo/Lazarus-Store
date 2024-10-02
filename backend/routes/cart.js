import express from 'express'
const router = express.Router()
import { authenticate } from '../middlewares/middleware.js'
import * as category from '../controllers/cart.js'

router.get('/', authenticate, category.getCart)
router.post('/add', authenticate, categotry. addProduct)
router.delete('/delete/:cartId', authenticate, category.removeCart) 

export default router