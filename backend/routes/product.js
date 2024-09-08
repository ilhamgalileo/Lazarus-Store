module.exports = app =>{
const product = require('../controllers/product')
const r = require ('express').Router()

r.get('/', product.FindMany)
r.get('/:id', product.findOne)
r.post('/', product.create)
r.put('/:id', product.update)
r.delete('/:id', product.delete)
app.use("/product",r)
}
