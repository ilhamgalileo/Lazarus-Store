const express = require('express')
const router = express.Router()
const { authenticate, authorizeAdmin } = require('../middlewares/middleware')
const category = require('../controllers/category')

router.post('/', authenticate,authorizeAdmin, category.createCate )
router.put('/:categoryId', authenticate,authorizeAdmin, category.updateCate )


module.exports = router