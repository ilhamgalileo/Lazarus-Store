import express from 'express'
import { authenticate } from '../middlewares/middleware.js'
import * as shipping from '../controllers/shipping.js'

const router = express.Router()

router.get('/provinces', authenticate, shipping.getProvinces)
router.get('/cities/:provinceId', authenticate, shipping.getCities)
router.get('/districts/:cityId', authenticate, shipping.getDistricts)

export default router