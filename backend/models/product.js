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
productSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})
const Product = mongoose.model('Product', productSchema)

module.exports = Product 