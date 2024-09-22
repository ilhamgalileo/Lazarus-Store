const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/middleware')
const { checkout } = require('../controllers/order')


router.post('/:cartId', authenticate, checkout) // Checkout menggunakan cartId

module.exports = router