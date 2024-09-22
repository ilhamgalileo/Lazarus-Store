const express = require('express')
const router = express.Router()
const { authenticate, authorizeAdmin } = require('../middlewares/middleware')
const { createCate } = require('../controllers/cart')


router.post('/', authenticate,authorizeAdmin, createCate )

module.exports = router