const express = require('express')
const router = express.Router()
const { authenticate, authorizeAdmin } = require('../middlewares/middleware')
const category = require('../controllers/category')

router.post('/', authenticate,authorizeAdmin, category.createCate )
router.put('/:categoryId', authenticate,authorizeAdmin, category.updateCate )
router.delete('/:categoryId', authenticate,authorizeAdmin, category.removeCate )
router.get('/list', authenticate,authorizeAdmin, category.categoryList )
router.get('/:id', authenticate,authorizeAdmin, category.findOne )

module.exports = router