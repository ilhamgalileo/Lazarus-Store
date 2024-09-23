const express = require('express')
const router = express.Router()
const product = require('../controllers/product')
const { authenticate, authorizeAdmin } = require('../middlewares/middleware')
const checkId = require('../middlewares/checkId')
const formidable = require('express-formidable')

router.get('/', product.FindMany)           
router.get('/:id', product.findOne)         
router.post('/', authenticate, authorizeAdmin, formidable(), product.create)           
router.put('/:id', authenticate, authorizeAdmin,formidable(), product.update)        
router.delete('/:id', product.delete)

module.exports = router