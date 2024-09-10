const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/middleware')
const cart = require('../controllers/cart')

router.get('/', authenticate, cart.getCart)            // Mendapatkan keranjang pengguna
router.post('/add', authenticate, cart.addProduct)     // Menambahkan produk ke keranjang
router.delete('/delete/:cartId', authenticate, cart.removeCart) // Menghapus keranjang berdasarkan cartId

module.exports = router