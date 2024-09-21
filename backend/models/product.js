const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id:          { type: String, required: true },
    name:        { type: String, required: true },
    brand:       { type: String, required: true },
    price:       { type: Number, required: true },
    description: { type: String},
    stock:       { type: Number, required: true }
}, {
    timestamps: true
})
const Product = mongoose.model('Product', productSchema)

module.exports = Product 