const express = require('express')
const router = express.Router()
const { authenticate, authorizeAdmin } = require('../middlewares/middleware')
const category = require('../controllers/category')

router.post('/', authenticate,authorizeAdmin, category.createCate )

module.exports = router