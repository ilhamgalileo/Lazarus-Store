const express = require('express')
const router = express.Router()
const product = require('../controllers/product')

router.get('/', product.FindMany)           // Mendapatkan semua produk
router.get('/:id', product.findOne)         // Mendapatkan produk berdasarkan ID
router.post('/', product.create)            // Menambahkan produk baru
router.put('/:id', product.update)          // Memperbarui produk berdasarkan ID
router.delete('/:id', product.delete)       // Menghapus produk berdasarkan ID

module.exports = router